import { useQueryClient } from '@tanstack/react-query'
import { addMonths, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { useAuthContext } from '@/contexts/auth'

import { DatePickerWithRange } from './ui/date-picker-with-range'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

const DateSelection = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [date, setDate] = useState({
    // quanto eu recarregar a página, eu pego a from e to da url e persisto eles o state
    from: searchParams.get('from')
      ? new Date(searchParams.get('from') + 'T00:00:00')
      : new Date(),
    to: searchParams.get('to')
      ? new Date(searchParams.get('to') + 'T00:00:00')
      : addMonths(new Date(), 1),
  })
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
