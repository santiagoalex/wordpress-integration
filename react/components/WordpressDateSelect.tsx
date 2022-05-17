import React, { useState } from 'react'
import { DatePicker, ButtonGroup, Button } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

type DateType = Date | undefined
interface WordpressDateSelectProps {
  date: DateType
  setDate: any
  endDate: DateType
  setEndDate: any
  setDateFilter: any
}

const WordpressDateSelect: StorefrontFunctionComponent<WordpressDateSelectProps> = ({
  date,
  setDate,
  endDate,
  setEndDate,
  setDateFilter,
}) => {
  const {
    culture: { locale },
  } = useRuntime()

  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(date)
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate)

  return (
    <div>
      <div>
        <DatePicker
          locale={locale}
          onChange={(newDate: Date) => {
            setTempStartDate(newDate)
            if (tempEndDate === undefined) {
              setTempEndDate(newDate)
            }
          }}
          value={tempStartDate}
        />
        <DatePicker
          locale={locale}
          onChange={(newDate: Date) => {
            setTempEndDate(newDate)
          }}
          value={tempEndDate}
          minDate={tempStartDate}
        />
        <ButtonGroup
          buttons={[
            <Button
              variation="primary"
              onClick={() => {
                setDateFilter(true)

                // flip dates if user enters start date later than end date
                if (
                  tempStartDate &&
                  tempEndDate &&
                  tempStartDate > tempEndDate
                ) {
                  setTempStartDate(tempEndDate)
                  setTempEndDate(tempStartDate)
                  setDate(tempEndDate)
                  setEndDate(tempStartDate)
                  return
                }

                setDate(tempStartDate)
                setEndDate(tempEndDate)
              }}
            >
              Apply
            </Button>,
            <Button
              variation="secondary"
              onClick={() => {
                setDateFilter(false)

                setTempStartDate(undefined)
                setTempEndDate(undefined)
                setDate(tempStartDate)
                setEndDate(tempEndDate)
              }}
            >
              Clear
            </Button>,
          ]}
        />
      </div>
    </div>
  )
}

export default WordpressDateSelect
