import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { DatePicker, Button, ButtonWithIcon, IconClose } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'dateSelectInnerContainer',
  'dateRangeInputsContainer',
  'dateInputContainer',
  'dateFilterButtonsContainer',
] as const

type DateType = Date | undefined
interface WordpressDateSelectProps {
  date: DateType
  setDate: any
  endDate: DateType
  setEndDate: any
  dateFilter: boolean
  setDateFilter: any
}

const WordpressDateSelect: StorefrontFunctionComponent<WordpressDateSelectProps> = ({
  date,
  setDate,
  endDate,
  setEndDate,
  dateFilter,
  setDateFilter,
}) => {
  const {
    culture: { locale },
  } = useRuntime()

  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(date)
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate)

  return (
    <div
      className={`${handles.dateSelectInnerContainer} flex flex-row justify-around`}
    >
      <div
        className={`${handles.dateRangeInputsContainer} flex flex-row justify-around`}
      >
        <div className={`${handles.dateInputContainer} pr1`}>
          <DatePicker
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            placeholder={intl.formatMessage(messages.filterByDate)}
            locale={locale}
            onChange={(newDate: Date) => {
              setTempStartDate(newDate)
              if (tempEndDate === undefined) {
                setTempEndDate(newDate)
              }
            }}
            value={tempStartDate}
          />
        </div>
        <div className={`${handles.dateInputContainer} pr1`}>
          <DatePicker
            locale={locale}
            onChange={(newDate: Date) => {
              setTempEndDate(newDate)
            }}
            value={tempEndDate}
            minDate={tempStartDate}
          />
        </div>
      </div>
      <div
        className={`${handles.dateFilterButtonsContainer} flex flex-row justify-around`}
      >
        <div className={`ph1`}>
          <Button
            variation="primary"
            onClick={() => {
              setDateFilter(true)

              // flip dates if user enters start date later than end date
              if (tempStartDate && tempEndDate && tempStartDate > tempEndDate) {
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
          </Button>
        </div>
        {dateFilter && (
          <div>
            <ButtonWithIcon
              icon={<IconClose />}
              variation="secondary"
              onClick={() => {
                setDateFilter(false)

                setTempStartDate(undefined)
                setTempEndDate(undefined)
                setDate(tempStartDate)
                setEndDate(tempEndDate)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const messages = defineMessages({
  filterByDate: {
    defaultMessage: 'Filter by date range',
    id: 'store/wordpress-integration.wordpressDateSelect.filterByDate',
  },
})

export default WordpressDateSelect
