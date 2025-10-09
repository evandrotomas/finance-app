import { useQueryClient } from '@tanstack/react-query'
import { addMonths, format, isValid } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { useAuthContext } from '@/contexts/auth'

import { DatePickerWithRange } from './ui/date-picker-with-range'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

const getInitialDateState = (searchParams) => {
  const defaultDate = {
    from: new Date(),
    to: addMonths(new Date(), 1),
  }
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  if (!from || !to) {
    return defaultDate
  }
  const datesAreInvalid = !isValid(new Date(from)) || !isValid(new Date(to))
  if (datesAreInvalid) {
    return defaultDate
  }
  return defaultDate
}

const DateSelection = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [date, setDate] = useState(getInitialDateState(searchParams))
  // sempre que o state "date" mudar, eu preciso persisti-lo na URL (?from&to=)
  useEffect(() => {
    // early return
    if (!date?.from || !date?.to) return
    const queryParams = new URLSearchParams()
    queryParams.set('from', formatDate(date.from))
    queryParams.set('to', formatDate(date.to))
    navigate(`/?${queryParams.toString()}`)
    queryClient.invalidateQueries({
      queryKey: [
        'balance',
        user.id,
        formatDate(date.from),
        formatDate(date.to),
      ],
    })
  }, [navigate, date, queryClient, user.id])

  return <DatePickerWithRange value={date} onChange={setDate} />
}

export default DateSelection
