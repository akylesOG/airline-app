import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { countryOutlines } from './mapData'

type AirportCode = 'ALA' | 'NQZ' | 'SVO' | 'IST' | 'DXB' | 'FRU' | 'TAS' | 'DEL' | 'HND' | 'BKK'
const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F']

interface Place {
  city: string
  airport: AirportCode
}

const airports: { code: AirportCode; city: string }[] = [
  { code: 'ALA', city: 'Almaty' },
  { code: 'NQZ', city: 'Novosibirsk' },
  { code: 'SVO', city: 'Moscow' },
  { code: 'TAS', city: 'Tashkent' },
  { code: 'DXB', city: 'Dubai' },
  { code: 'FRU', city: 'Bishkek' },
  { code: 'IST', city: 'Istanbul' },
  { code: 'DEL', city: 'Delhi' },
  { code: 'HND', city: 'Tokyo' },
  { code: 'BKK', city: 'Bangkok' },
]

interface City {
  code: AirportCode
  city: string
  country: string
  description: string
}

const cities: City[] = [
  { code: 'ALA', city: 'Almaty', country: 'Kazakhstan', description: 'A lively mountain city with leafy streets, cafe culture, and the Tian Shan on its doorstep.' },
  { code: 'NQZ', city: 'Novosibirsk', country: 'Russia', description: 'A major Siberian hub known for its riverfront, opera house, and wide-open horizons.' },
  { code: 'SVO', city: 'Moscow', country: 'Russia', description: 'A grand capital of historic squares, celebrated architecture, and lively neighborhoods.' },
  { code: 'TAS', city: 'Tashkent', country: 'Uzbekistan', description: 'A welcoming Silk Road city blending grand avenues, markets, and rich local cuisine.' },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', description: 'A modern desert destination with iconic skylines, beaches, and memorable escapes.' },
  { code: 'FRU', city: 'Bishkek', country: 'Kyrgyzstan', description: 'An easygoing city base for mountain trails, local markets, and Kyrgyz hospitality.' },
  { code: 'IST', city: 'Istanbul', country: 'Türkiye', description: 'A city between continents, full of historic streets, waterside views, and great food.' },
  { code: 'DEL', city: 'Delhi', country: 'India', description: 'Explore centuries of history, lively bazaars, and the flavors of North India.' },
  { code: 'HND', city: 'Tokyo', country: 'Japan', description: 'Discover a dazzling mix of neighborhood traditions, design, and food.' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', description: 'Visit riverside temples, bustling markets, and the heart of Thai cuisine.' },
]

interface Country {
  name: string
  description: string
  style: string
  image: string
  cityCodes: AirportCode[]
}

const countries: Country[] = [
  { name: 'Kazakhstan', description: 'Wide open landscapes, mountain escapes, and vibrant city life.', style: 'kazakhstan', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85', cityCodes: ['ALA'] },
  { name: 'Russia', description: 'Historic capitals and a gateway to vast Siberian horizons.', style: 'russia', image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=85', cityCodes: ['NQZ', 'SVO'] },
  { name: 'Uzbekistan', description: 'Follow the Silk Road through colorful markets and storied cities.', style: 'uzbekistan', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85', cityCodes: ['TAS'] },
  { name: 'United Arab Emirates', description: 'Desert coastlines, modern skylines, and warm Arabian hospitality.', style: 'uae', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85', cityCodes: ['DXB'] },
  { name: 'Kyrgyzstan', description: 'Mountain adventures begin in welcoming, easygoing cities.', style: 'kyrgyzstan', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', cityCodes: ['FRU'] },
  { name: 'Türkiye', description: 'Explore a crossroads of cultures, cuisine, and coastlines.', style: 'turkiye', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85', cityCodes: ['IST'] },
  { name: 'India', description: 'Historic landmarks, colorful bazaars, and remarkable regional cuisine.', style: 'india', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85', cityCodes: ['DEL'] },
  { name: 'Japan', description: 'Find timeless traditions alongside the energy of modern Tokyo.', style: 'japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85', cityCodes: ['HND'] },
  { name: 'Thailand', description: 'Riverside temples, lively street markets, and welcoming city life.', style: 'thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=85', cityCodes: ['BKK'] },
]

interface Flight {
  id: string
  from: Place
  to: Place
  departure: string
  arrival: string
  airline: string
  aircraft: string
  price: number
  seatsTotal: number
  seatsLeft: number
  occupiedSeats: string[]
}

const noFreeSeatsMessage = "This plane doesn't have any free seats."

interface AdminFlight extends Flight {
  bookingCount: number
  bookedTravelers: number
  grossSales: number
  discounts: number
  revenue: number
  airlinePayout: number
  companyProfit: number
  status: 'Scheduled' | 'Flying now' | 'Completed'
}

interface Offer {
  id: string
  title: string
  description: string
  code: string
  discountPercent: number
  expiresAt: string
}

interface Trip {
  id: string
  reference: string
  passengerName: string
  email: string
  travelers: number
  seats?: string[]
  grossSales: number
  discounts: number
  totalPrice: number
  airlinePayout: number
  companyProfit: number
  offerCode: string | null
  status: string
  createdAt: string
  flight: Flight
}

interface BookingConfirmation {
  reference: string
  flightId: string
  passengerName: string
  travelers: number
  seats: string[]
  grossSales: number
  discounts: number
  totalPrice: number
  airlinePayout: number
  companyProfit: number
  offerCode: string | null
  flight: Flight
}

type ModalName = 'trips' | 'offers' | 'support' | 'booking' | 'country' | 'admin' | null
type ThemeMode = 'light' | 'dark'

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error ?? 'The request could not be completed.')
  }
  return result as T
}

const formatTime = (iso: string) => {
  const [, time, offset] = iso.match(/T(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/) ?? []
  if (!time || !offset) return iso
  return `${time} ${offset === 'Z' ? 'UTC' : `UTC${offset}`}`
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${iso.slice(0, 10)}T12:00:00Z`))
const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

interface SeatPickerProps {
  flight: Flight
  travelers: number
  selectedSeats: string[]
  onToggle: (seat: string) => void
}

function SeatPicker({ flight, travelers, selectedSeats, onToggle }: SeatPickerProps) {
  const occupiedSeats = new Set(flight.occupiedSeats)
  const selectedSeatSet = new Set(selectedSeats)
  const totalRows = Math.ceil(flight.seatsTotal / seatLetters.length)

  const renderSeat = (row: number, letter: string) => {
    const seat = `${row}${letter}`
    const seatIndex = (row - 1) * seatLetters.length + seatLetters.indexOf(letter)
    if (seatIndex >= flight.seatsTotal) {
      return <span key={seat} className="seat-map-space" aria-hidden="true" />
    }

    const isOccupied = occupiedSeats.has(seat)
    const isSelected = selectedSeatSet.has(seat)
    const selectionIsFull = selectedSeats.length >= travelers && !isSelected
    const status = isOccupied ? 'booked' : isSelected ? 'selected' : 'available'
    return (
      <button
        key={seat}
        type="button"
        className={`seat-map-seat ${status}`}
        aria-label={`Seat ${seat}, ${isOccupied ? 'booked' : isSelected ? 'selected' : 'available'}`}
        aria-pressed={isSelected}
        disabled={isOccupied || selectionIsFull}
        onClick={() => onToggle(seat)}
      >
        {letter}
      </button>
    )
  }

  return (
    <section className="seat-picker" aria-labelledby="seat-picker-title">
      <div className="seat-picker-heading">
        <div>
          <h3 id="seat-picker-title">Choose your seats</h3>
          <p>Select {travelers} seat{travelers === 1 ? '' : 's'} for this flight.</p>
        </div>
        <strong>{selectedSeats.length} / {travelers} selected</strong>
      </div>
      <div className="seat-map-legend" aria-label="Seat availability">
        <span><i className="available" />Available</span>
        <span><i className="booked" />Booked</span>
        <span><i className="selected" />Your selection</span>
      </div>
      <div className="seat-map-scroll" role="group" aria-label={`${flight.aircraft} seat map with ${flight.seatsTotal} seats`}>
        <div className="seat-map-grid">
          <div className="seat-map-row seat-map-header" aria-hidden="true">
            {seatLetters.slice(0, 3).map((letter) => <span key={letter}>{letter}</span>)}
            <span className="seat-map-row-number" />
            {seatLetters.slice(3).map((letter) => <span key={letter}>{letter}</span>)}
          </div>
          {Array.from({ length: totalRows }, (_, index) => {
            const row = index + 1
            return (
              <div className="seat-map-row" key={row}>
                {seatLetters.slice(0, 3).map((letter) => renderSeat(row, letter))}
                <span className="seat-map-row-number">{row}</span>
                {seatLetters.slice(3).map((letter) => renderSeat(row, letter))}
              </div>
            )
          })}
        </div>
      </div>
      <p className="seat-picker-summary" role="status" aria-live="polite">
        {selectedSeats.length === travelers
          ? `Selected seats: ${selectedSeats.join(', ')}`
          : `Select ${travelers - selectedSeats.length} more seat${travelers - selectedSeats.length === 1 ? '' : 's'}.`}
      </p>
    </section>
  )
}

const mapBounds = { west: 25, east: 200, south: -12, north: 82 }
const airportLocations: Record<AirportCode, { longitude: number; latitude: number }> = {
  ALA: { longitude: 76.9129, latitude: 43.222 },
  NQZ: { longitude: 82.92, latitude: 55.01 },
  SVO: { longitude: 37.4146, latitude: 55.9726 },
  IST: { longitude: 28.7519, latitude: 41.2753 },
  DEL: { longitude: 77.1000, latitude: 28.5562 },
  HND: { longitude: 139.7798, latitude: 35.5494 },
  BKK: { longitude: 100.7472, latitude: 13.6900 },
  DXB: { longitude: 55.3644, latitude: 25.2532 },
  FRU: { longitude: 74.4776, latitude: 42.8746 },
  TAS: { longitude: 69.2812, latitude: 41.2579 },
}
const projectAirport = ({ longitude, latitude }: { longitude: number; latitude: number }) => ({
  x: 24 + ((longitude - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 1252,
  y: 18 + ((mapBounds.north - latitude) / (mapBounds.north - mapBounds.south)) * 614,
})
const airportCoordinates: Record<AirportCode, { x: number; y: number }> = {
  ALA: projectAirport(airportLocations.ALA),
  NQZ: projectAirport(airportLocations.NQZ),
  SVO: projectAirport(airportLocations.SVO),
  IST: projectAirport(airportLocations.IST),
  DXB: projectAirport(airportLocations.DXB),
  FRU: projectAirport(airportLocations.FRU),
  TAS: projectAirport(airportLocations.TAS),
  DEL: projectAirport(airportLocations.DEL),
  HND: projectAirport(airportLocations.HND),
  BKK: projectAirport(airportLocations.BKK),
}
const airportLabelOffsets: Record<AirportCode, { x: number; y: number }> = {
  ALA: { x: 8, y: 20 },
  NQZ: { x: 8, y: -8 },
  SVO: { x: 8, y: -8 },
  IST: { x: 8, y: -8 },
  DXB: { x: 8, y: -8 },
  FRU: { x: -48, y: -10 },
  TAS: { x: -60, y: 18 },
  DEL: { x: 8, y: -10 },
  HND: { x: 8, y: -8 },
  BKK: { x: 8, y: 17 },
}

const flightPosition = (start: { x: number; y: number }, end: { x: number; y: number }, progress: number) => {
  const control = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 45 }
  const remaining = 1 - progress
  return {
    x: remaining ** 2 * start.x + 2 * remaining * progress * control.x + progress ** 2 * end.x,
    y: remaining ** 2 * start.y + 2 * remaining * progress * control.y + progress ** 2 * end.y,
  }
}

function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [adminFlights, setAdminFlights] = useState<AdminFlight[]>([])
  const [adminBookings, setAdminBookings] = useState<Trip[]>([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [adminToken, setAdminToken] = useState('')
  const [adminFilter, setAdminFilter] = useState<'All' | AdminFlight['status']>('All')
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleteMessage, setDeleteMessage] = useState('')
  const [theme, setTheme] = useState<ThemeMode>(() =>
    window.localStorage.getItem('skyjet-theme') === 'dark' ? 'dark' : 'light',
  )
  const [liveNow, setLiveNow] = useState(0)
  const [isLiveMapOpen, setIsLiveMapOpen] = useState(false)
  const [activeCountryName, setActiveCountryName] = useState<string | null>(null)
  const [activeCityCode, setActiveCityCode] = useState<AirportCode | null>(null)
  const [searchedFlights, setSearchedFlights] = useState<Flight[] | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [searchFrom, setSearchFrom] = useState<AirportCode>('ALA')
  const [searchTo, setSearchTo] = useState<AirportCode>('DXB')
  const [searchDate, setSearchDate] = useState('2026-11-12')
  const [searchTravelers, setSearchTravelers] = useState(1)
  const [searchMessage, setSearchMessage] = useState('')
  const [modal, setModal] = useState<ModalName>(null)
  const [backendError, setBackendError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState<BookingConfirmation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tripEmail, setTripEmail] = useState('')
  const [trips, setTrips] = useState<Trip[] | null>(null)
  const [passengerName, setPassengerName] = useState('')
  const [bookingEmail, setBookingEmail] = useState('')
  const [travelers, setTravelers] = useState(1)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [offerCode, setOfferCode] = useState('')
  const [supportName, setSupportName] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [supportTopic, setSupportTopic] = useState('Booking')
  const [supportMessage, setSupportMessage] = useState('')

  const selectedFlight = flights.find((flight) => flight.id === selectedId)
  const activeCountry = countries.find((country) => country.name === activeCountryName)
  const activeCity = cities.find((city) => city.code === activeCityCode)
  const activeCityFlights = activeCity
    ? flights.filter((flight) =>
        flight.from.airport === activeCity.code || flight.to.airport === activeCity.code,
      )
    : []
  const filteredAdminFlights = adminFilter === 'All'
    ? adminFlights
    : adminFlights.filter((flight) => flight.status === adminFilter)
  const adminTotals = adminFlights.reduce((totals, flight) => ({
    grossSales: totals.grossSales + flight.grossSales,
    discounts: totals.discounts + flight.discounts,
    revenue: totals.revenue + flight.revenue,
    airlinePayout: totals.airlinePayout + flight.airlinePayout,
    companyProfit: totals.companyProfit + flight.companyProfit,
  }), { grossSales: 0, discounts: 0, revenue: 0, airlinePayout: 0, companyProfit: 0 })
  const airlineTotals = Object.values(adminFlights.reduce<Record<string, {
    airline: string
    revenue: number
    airlinePayout: number
    companyProfit: number
  }>>((totals, flight) => {
    const total = totals[flight.airline] ?? {
      airline: flight.airline,
      revenue: 0,
      airlinePayout: 0,
      companyProfit: 0,
    }
    total.revenue += flight.revenue
    total.airlinePayout += flight.airlinePayout
    total.companyProfit += flight.companyProfit
    totals[flight.airline] = total
    return totals
  }, {}))
  const liveFlights = flights.filter((flight) => {
    const departure = new Date(flight.departure).getTime()
    const arrival = new Date(flight.arrival).getTime()
    return departure <= liveNow && liveNow < arrival
  })
  const uniqueRoutes = flights.filter((flight, index, allFlights) =>
    allFlights.findIndex((other) =>
      other.from.airport === flight.from.airport && other.to.airport === flight.to.airport,
    ) === index,
  )

  useEffect(() => {
    const initialClock = window.setTimeout(() => setLiveNow(Date.now()), 0)
    const timer = window.setInterval(() => setLiveNow(Date.now()), 15_000)
    return () => {
      window.clearTimeout(initialClock)
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('skyjet-theme', theme)
  }, [theme])

  useEffect(() => {
    Promise.all([
      apiRequest<Flight[]>('/api/flights'),
      apiRequest<Offer[]>('/api/offers'),
    ])
      .then(([flightData, offerData]) => {
        setFlights(flightData)
        setOffers(offerData)
      })
      .catch((error: Error) => setBackendError(error.message))
  }, [])

  const openModal = (name: Exclude<ModalName, null>) => {
    setModal(name)
    setActionError('')
    setActionMessage('')
    setTrips(null)
    if (name === 'booking') {
      setConfirmedBooking(null)
      setSelectedSeats([])
      const availableSeats = selectedFlight?.seatsLeft ?? 1
      setTravelers((currentTravelers) => Math.max(1, Math.min(currentTravelers, 9, availableSeats)))
    }
  }

  const loadAdminHistory = async (token: string) => {
    setAdminLoading(true)
    setAdminError('')
    try {
      const [flightHistory, bookingHistory] = await Promise.all([
        apiRequest<AdminFlight[]>('/api/admin/flights', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiRequest<Trip[]>('/api/admin/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      setAdminFlights(flightHistory)
      setAdminBookings(bookingHistory)
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Could not load flight history.')
    } finally {
      setAdminLoading(false)
    }
  }

  const handleDeleteBookingsByEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = deleteEmail.trim().toLowerCase()
    if (!email || !adminToken) return
    const matches = adminBookings.filter((booking) => booking.email === email).length
    if (!window.confirm(`Delete ${matches || 'all'} booking(s) for ${email}? This cannot be undone.`)) return
    setAdminLoading(true)
    setAdminError('')
    setDeleteMessage('')
    try {
      const { deleted } = await apiRequest<{ deleted: number }>(
        `/api/admin/bookings?email=${encodeURIComponent(email)}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` } },
      )
      setDeleteEmail('')
      setDeleteMessage(`Deleted ${deleted} booking(s) for ${email}.`)
      setFlights(await apiRequest<Flight[]>('/api/flights'))
      await loadAdminHistory(adminToken)
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Could not delete bookings.')
      setAdminLoading(false)
    }
  }

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAdminLoading(true)
    setAdminError('')
    try {
      const { token } = await apiRequest<{ token: string }>('/api/admin/session', {
        method: 'POST',
        body: JSON.stringify({ code: adminCode }),
      })
      setAdminToken(token)
      setAdminCode('')
      await loadAdminHistory(token)
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Admin sign-in failed.')
      setAdminLoading(false)
    }
  }

  useEffect(() => {
    let presses: number[] = []

    const handleAdminShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'u' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
      if (
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName))
      ) return

      const now = Date.now()
      presses = presses.filter((time) => now - time < 1500)
      presses.push(now)
      if (presses.length < 3) return

      presses = []
      setModal('admin')
      setAdminCode('')
      setAdminError('')
      setAdminToken('')
      setActionError('')
      setActionMessage('')
    }

    window.addEventListener('keydown', handleAdminShortcut)
    return () => window.removeEventListener('keydown', handleAdminShortcut)
  }, [])

  const handleBookingEmailChange = (value: string) => {
    setBookingEmail(value.trimStart())
  }

  const openCountry = (country: Country) => {
    setActiveCountryName(country.name)
    setActiveCityCode(null)
    setModal('country')
    setActionError('')
    setActionMessage('')
  }

  const chooseCity = (code: AirportCode) => {
    setActiveCityCode(code)
  }

  const chooseCityFlight = (flight: Flight) => {
    setSearchFrom(flight.from.airport)
    setSearchTo(flight.to.airport)
    setSearchDate(flight.departure.slice(0, 10))
    setSearchedFlights(flights.filter((candidate) =>
      candidate.from.airport === flight.from.airport &&
      candidate.to.airport === flight.to.airport &&
      candidate.departure.slice(0, 10) === flight.departure.slice(0, 10),
    ))
    setSelectedId(flight.id)
    setSearchMessage(`Flight ${flight.id} is ready to review in the flight search panel.`)
    setModal(null)
    window.setTimeout(() => document.getElementById('flight-search')?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedFlight) return
    if (selectedSeats.length !== travelers) {
      setActionError(`Choose ${travelers === 1 ? 'a seat' : `${travelers} seats`} for your travelers before confirming.`)
      return
    }
    setIsSubmitting(true)
    setActionError('')
    const normalizedEmail = bookingEmail.trim().toLowerCase()
    setBookingEmail(normalizedEmail)
    try {
      const booking = await apiRequest<BookingConfirmation>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          flightId: selectedFlight.id,
          passengerName,
          email: normalizedEmail,
          travelers,
          seats: selectedSeats,
          offerCode,
        }),
      })
      setConfirmedBooking(booking)
      setFlights((currentFlights) =>
        currentFlights.map((flight) => flight.id === booking.flight.id ? booking.flight : flight),
      )
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Booking failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTripLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setActionError('')
    try {
      setTrips(
        await apiRequest<Trip[]>(`/api/trips?email=${encodeURIComponent(tripEmail)}`),
      )
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not load trips.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSupportRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setActionError('')
    try {
      const result = await apiRequest<{ message: string }>('/api/support', {
        method: 'POST',
        body: JSON.stringify({
          name: supportName,
          email: supportEmail,
          topic: supportTopic,
          message: supportMessage,
        }),
      })
      setActionMessage(result.message)
      setSupportMessage('')
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not send message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFlightSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchFrom === searchTo) {
      setSearchMessage('Choose different departure and destination airports.')
      setSearchedFlights([])
      setSelectedId('')
      return
    }

    const matches = flights.filter((flight) =>
      flight.from.airport === searchFrom &&
      flight.to.airport === searchTo &&
      flight.departure.slice(0, 10) === searchDate,
    )
    const availableMatches = matches.filter((flight) => flight.seatsLeft >= searchTravelers)
    setSearchedFlights(matches)
    setSearchMessage(
      !matches.length
        ? 'No flights found for those details. Try another date or route.'
        : availableMatches.length
          ? `${matches.length} flight${matches.length === 1 ? '' : 's'} found for ${searchTravelers} traveler${searchTravelers === 1 ? '' : 's'}.`
          : matches.every((flight) => flight.seatsLeft === 0)
            ? noFreeSeatsMessage
            : `Flights found, but they don't have enough free seats for ${searchTravelers} traveler${searchTravelers === 1 ? '' : 's'}.`,
    )
    setSelectedId((availableMatches[0] ?? matches[0])?.id ?? '')
  }

  const selectPopularFlight = (flight: Flight) => {
    const departureDate = flight.departure.slice(0, 10)
    const routeFlights = flights.filter((candidate) =>
      candidate.from.airport === flight.from.airport &&
      candidate.to.airport === flight.to.airport &&
      candidate.departure.slice(0, 10) === departureDate &&
      (candidate.id === flight.id || candidate.seatsLeft >= searchTravelers),
    )
    setSearchFrom(flight.from.airport)
    setSearchTo(flight.to.airport)
    setSearchDate(departureDate)
    setSearchedFlights(routeFlights)
    setSelectedId(flight.id)
    setSearchMessage(`Flight ${flight.id} selected. Review its details above.`)
    window.setTimeout(() => document.getElementById('flight-search')?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const swapSearchRoute = () => {
    setSearchFrom(searchTo)
    setSearchTo(searchFrom)
  }

  const reserveSelectedFlight = () => {
    if (!selectedFlight || selectedFlight.seatsLeft < searchTravelers) return
    setTravelers(searchTravelers)
    openModal('booking')
  }

  const toggleSeat = (seat: string) => {
    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seat)) return currentSeats.filter((selectedSeat) => selectedSeat !== seat)
      if (currentSeats.length >= travelers) return currentSeats
      return [...currentSeats, seat]
    })
  }

  const visibleFlights = searchedFlights ?? flights
  const labeledAsianCountries = new Set([
    'Russia',
    'Turkey',
    'Saudi Arabia',
    'India',
    'China',
    'Mongolia',
    'Kazakhstan',
    'Iran',
    'Pakistan',
    'Afghanistan',
    'Thailand',
    'Vietnam',
    'Indonesia',
    'Japan',
    'South Korea',
    'Philippines',
    'Myanmar',
    'Malaysia',
  ])

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <div className="brand-wrap">
          <img className="brand-logo" src="/emikettik-logo.png" alt="EmiKettik Flight Tickets" />
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#explore">Explore</a>
          <button type="button" onClick={() => openModal('trips')}>Trips</button>
          <button type="button" onClick={() => openModal('offers')}>Offers</button>
          <button type="button" onClick={() => openModal('support')}>Support</button>
        </nav>

        <div className="topbar-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button type="button" className="primary-button small-btn" onClick={() => openModal('booking')}>Book now</button>
        </div>
      </header>

      {backendError && (
        <p className="backend-error" role="alert">
          Could not connect to the airline service: {backendError} Start the backend with
          {' '}<code>npm run backend</code> from the Web folder.
        </p>
      )}

      <main className="content-grid" id="flight-search">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="eyebrow-row">
              <span className="pill">Summer routes</span>
              <span className="status-dot" aria-label="Live booking status" />
              <button
                type="button"
                className="live-fares-button"
                onClick={() => {
                  setSearchedFlights(null)
                  setSearchMessage(`Showing current fares for ${flights.length} flights.`)
                  window.setTimeout(() => document.getElementById('popular-flights')?.scrollIntoView({ behavior: 'smooth' }), 0)
                }}
              >
                Live fares
              </button>
            </div>
            <h1>Fly farther, arrive easier.</h1>
            <p className="lede">
              Explore destinations across Asia with flexible fares and premium comfort.
            </p>
            <form className="search-card" aria-label="Flight search" onSubmit={handleFlightSearch}>
              <div className="route-fields">
                <div className="field-group">
                  <label htmlFor="search-from">From</label>
                  <select id="search-from" value={searchFrom} onChange={(event) => setSearchFrom(event.target.value as AirportCode)}>
                    {airports.map((airport) => (
                      <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>
                    ))}
                  </select>
                </div>
                <button type="button" className="swap-button" aria-label="Swap departure and destination" onClick={swapSearchRoute}>
                  ⇄
                </button>
                <div className="field-group">
                  <label htmlFor="search-to">To</label>
                  <select id="search-to" value={searchTo} onChange={(event) => setSearchTo(event.target.value as AirportCode)}>
                    {airports.map((airport) => (
                      <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="search-date">Departure</label>
                <input id="search-date" type="date" value={searchDate} onChange={(event) => setSearchDate(event.target.value)} required />
              </div>
              <div className="field-group">
                <label htmlFor="search-travelers">Travelers</label>
                <select id="search-travelers" value={searchTravelers} onChange={(event) => setSearchTravelers(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
                    <option key={count} value={count}>{count} {count === 1 ? 'adult' : 'adults'}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="primary-button search-button">
                Search flights
              </button>
            </form>
            {searchMessage && <p className="search-message" role="status">{searchMessage}</p>}
            {searchedFlights && searchedFlights.length > 0 && (
              <div className="hero-flight-results" aria-label="Choose a flight">
                {searchedFlights.map((flight) => {
                  const isSelected = flight.id === selectedId
                  return (
                    <button
                      type="button"
                      key={flight.id}
                      className={`hero-flight-option ${isSelected ? 'selected' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedId(flight.id)
                        setSearchMessage(`Flight ${flight.id} selected. Review its details and reserve below.`)
                      }}
                    >
                      <span className="hero-flight-option-main">
                        <strong>{flight.from.city} <span>→</span> {flight.to.city}</strong>
                        <small>
                          Flight {flight.id} · {formatTime(flight.departure)} · {flight.seatsLeft === 0
                            ? noFreeSeatsMessage
                            : `${flight.seatsLeft} seats available`}
                        </small>
                      </span>
                      <span className="hero-flight-option-fare">${flight.price}</span>
                      <span className="hero-flight-option-check" aria-hidden="true">{isSelected ? '✓' : 'Select'}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="hero-portrait">
            <img src="/skyjet-travel-host.png" alt="Your EmiKettik travel host offering flight tickets" />
            <div className="hero-portrait-caption">
              <strong>Your journey starts here</strong>
              <span>Friendly help from booking to boarding.</span>
            </div>
          </div>
        </section>

        <aside className="summary-panel">
          {selectedFlight ? (
            <>
              <p className="summary-label">Selected flight</p>
              <h2>
                {selectedFlight.from.city} <span>→</span> {selectedFlight.to.city}
              </h2>

              <div className="route-meta">
                <span>Flight {selectedFlight.id}</span>
                <span>{selectedFlight.airline}</span>
                <span>{selectedFlight.aircraft}</span>
                <span>{selectedFlight.from.airport}</span>
                <span>→</span>
                <span>{selectedFlight.to.airport}</span>
              </div>

              {selectedFlight.seatsLeft === 0 && (
                <p className="seat-status sold-out" role="status">{noFreeSeatsMessage}</p>
              )}

              <div className="detail-grid">
                <div>
                  <p>Departure</p>
                  <strong>{formatDate(selectedFlight.departure)}</strong>
                  <small>{formatTime(selectedFlight.departure)}</small>
                </div>
                <div>
                  <p>Arrival</p>
                  <strong>{formatDate(selectedFlight.arrival)}</strong>
                  <small>{formatTime(selectedFlight.arrival)}</small>
                </div>
              </div>

              <div className="price-box">
                <span>From</span>
                <strong>${selectedFlight.price}</strong>
                <small>per traveler</small>
              </div>

              <button
                type="button"
                className="primary-button full-width"
                onClick={reserveSelectedFlight}
                disabled={selectedFlight.seatsLeft < searchTravelers}
              >
                {selectedFlight.seatsLeft === 0
                  ? 'No free seats'
                  : selectedFlight.seatsLeft < searchTravelers
                    ? 'Not enough seats'
                    : `Reserve ${searchTravelers === 1 ? 'seat' : `${searchTravelers} seats`}`}
              </button>
            </>
          ) : (
            <p>
              {backendError
                ? 'Flight information is currently unavailable.'
                : searchedFlights
                  ? 'No selected flight matches your search.'
                  : 'Search for a flight above, then select an option to see its details.'}
            </p>
          )}
        </aside>
      </main>

      <section id="explore" className="explore-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Explore</p>
            <h3>Explore by country</h3>
          </div>
          <span className="city-count">{countries.length} countries</span>
        </div>

        <div className="explore-grid">
          {countries.map((country) => {
            const countryCities = country.cityCodes
              .map((code) => cities.find((city) => city.code === code))
              .filter((city): city is City => city !== undefined)
            const countryFlights = flights.filter((flight) =>
              country.cityCodes.includes(flight.from.airport) || country.cityCodes.includes(flight.to.airport),
            )
            const lowestFare = countryFlights.length
              ? Math.min(...countryFlights.map((flight) => flight.price))
              : null
            return (
              <button
                type="button"
                key={country.name}
                className={`explore-card country-card ${country.style}`}
                onClick={() => openCountry(country)}
              >
                <div className="explore-copy">
                  <span className="explore-tag">{countryCities.length} {countryCities.length === 1 ? 'destination' : 'destinations'}</span>
                  <h4>{country.name}</h4>
                  <p>{country.description}</p>
                </div>
                <div className="explore-meta">
                  <span>{countryCities.map((city) => city.city).join(' · ')}</span>
                  <strong>{lowestFare === null ? 'Explore' : `From $${lowestFare}`}</strong>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="live-map-section" aria-labelledby="live-map-title">
        <div className="section-header">
          <div>
            <p className="section-kicker">Flight tracking</p>
            <h3 id="live-map-title">Asia flight map</h3>
            <span className="map-country-count">{countryOutlines.length} countries across Asia</span>
          </div>
          <button
            type="button"
            className="live-flight-count"
            aria-label={isLiveMapOpen ? 'Hide live flight map' : `Planes flying right now: ${liveFlights.length}`}
            aria-expanded={isLiveMapOpen}
            aria-controls={isLiveMapOpen ? 'live-flight-map' : undefined}
            onClick={() => setIsLiveMapOpen((open) => !open)}
          >
            <span className="status-dot" aria-hidden="true" />
            {isLiveMapOpen ? 'Hide live map' : (
              <>Planes flying right now <span className="live-flight-count-number">{liveFlights.length}</span></>
            )}
            <span className="map-toggle-chevron" aria-hidden="true">{isLiveMapOpen ? '−' : '+'}</span>
          </button>
        </div>

        {isLiveMapOpen && <div className="live-map-layout" id="live-flight-map">
          <div className="route-map">
            <svg viewBox="0 0 1300 650" role="img" aria-label={`Map of Asia with ${countryOutlines.length} country boundaries and EmiKettik flight routes`}>
              <g className="map-graticule" aria-hidden="true">
                {[0, 20, 40, 60, 80].map((latitude) => {
                  const y = 18 + ((mapBounds.north - latitude) / (mapBounds.north - mapBounds.south)) * 614
                  return <line key={`lat-${latitude}`} x1="24" x2="1276" y1={y} y2={y} />
                })}
                {[40, 60, 80, 100, 120, 140, 160, 180].map((longitude) => {
                  const x = 24 + ((longitude - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 1252
                  return <line key={`lon-${longitude}`} y1="18" y2="632" x1={x} x2={x} />
                })}
              </g>
              <g className="map-countries" aria-hidden="true">
                {countryOutlines.map((country, index) => (
                  <path
                    className={`asia-country tone-${index % 6}`}
                    d={country.path}
                    key={country.name}
                  >
                    <title>{country.name}</title>
                  </path>
                ))}
              </g>
              <g className="map-country-labels" aria-hidden="true">
                {countryOutlines.filter((country) => labeledAsianCountries.has(country.name)).map((country) => (
                  <text key={country.name} x={country.labelX} y={country.labelY}>{country.name.toUpperCase()}</text>
                ))}
              </g>
              {uniqueRoutes.map((flight) => {
                const start = airportCoordinates[flight.from.airport]
                const end = airportCoordinates[flight.to.airport]
                const isLive = liveFlights.some((liveFlight) =>
                  liveFlight.from.airport === flight.from.airport &&
                  liveFlight.to.airport === flight.to.airport,
                )
                return (
                  <path
                    key={`${flight.from.airport}-${flight.to.airport}`}
                    className={`map-route ${isLive ? 'active' : ''}`}
                    d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - 45} ${end.x} ${end.y}`}
                  />
                )
              })}
              {liveFlights.map((flight) => {
                const start = airportCoordinates[flight.from.airport]
                const end = airportCoordinates[flight.to.airport]
                const departure = new Date(flight.departure).getTime()
                const arrival = new Date(flight.arrival).getTime()
                const progress = Math.min(1, Math.max(0, (liveNow - departure) / (arrival - departure)))
                const position = flightPosition(start, end, progress)
                const angle = Math.atan2(end.y - position.y, end.x - position.x) * (180 / Math.PI)
                return (
                  <g key={flight.id} className="map-aircraft" transform={`translate(${position.x} ${position.y}) rotate(${angle})`}>
                    <circle r="13" />
                    <path d="M 14 0 L 1 -3 L 2 -10 L 0 -11 L -3 -3 L -12 -3 L -14 -1 L -14 1 L -12 3 L -3 3 L 0 11 L 2 10 L 1 3 Z" />
                    <title>{`Flight ${flight.id}, ${flight.from.city} to ${flight.to.city}`}</title>
                  </g>
                )
              })}
              {airports.map((airport) => {
                const position = airportCoordinates[airport.code]
                const labelOffset = airportLabelOffsets[airport.code]
                return (
                  <g className="map-airport" key={airport.code}>
                    <circle cx={position.x} cy={position.y} r="4" />
                    <text x={position.x + labelOffset.x} y={position.y + labelOffset.y}>{airport.city}</text>
                  </g>
                )
              })}
            </svg>
          </div>
          <div className="live-flight-list" aria-live="polite">
            {liveFlights.length ? liveFlights.map((flight) => (
              <article className="live-flight-card" key={flight.id}>
                <div className="live-flight-card-heading">
                  <strong>Flight {flight.id}</strong>
                  <span className="admin-status flying-now">Flying now</span>
                </div>
                <p>{flight.from.city} <span>→</span> {flight.to.city}</p>
                <small>{flight.airline} · {flight.aircraft}</small>
                <small>Arrives {formatTime(flight.arrival)}</small>
              </article>
            )) : (
              <p className="empty-state">No aircraft are airborne right now. Scheduled routes are shown on the map.</p>
            )}
          </div>
        </div>}
        {isLiveMapOpen && <p className="map-disclaimer">Asia-wide map with country borders. Demo aircraft positions are simulated from schedules, not live GPS.</p>}
      </section>

      <section id="popular-flights" className="flight-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Best flights</p>
            <h3>Popular departures</h3>
          </div>
          <button
            type="button"
            className="view-all-button"
            onClick={() => {
              setSearchedFlights(null)
              setSearchMessage(`Showing all ${flights.length} flights.`)
              setSelectedId('')
            }}
          >
            View all
          </button>
        </div>

        <div className="flight-list" role="list">
          {visibleFlights.length > 0 ? visibleFlights.map((flight) => {
            const isSelected = flight.id === selectedId
            return (
              <button
                key={flight.id}
                type="button"
                className={`flight-card ${isSelected ? 'selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => selectPopularFlight(flight)}
              >
                <div className="flight-topline">
                  <div className="flight-identification">
                    <span className="airline-name">{flight.airline}</span>
                    <span className="aircraft-name">{flight.aircraft}</span>
                    <span className="flight-id">Flight {flight.id}</span>
                  </div>
                  <span className={`seat-pill ${flight.seatsLeft === 0 ? 'sold-out' : ''}`}>
                    {flight.seatsLeft === 0 ? "Plane doesn't have any free seats" : `${flight.seatsLeft} seats left`}
                  </span>
                </div>

                <div className="flight-route">
                  <div>
                    <strong>{flight.from.airport}</strong>
                    <small>{flight.from.city}</small>
                  </div>
                  <span className="route-arrow">→</span>
                  <div>
                    <strong>{flight.to.airport}</strong>
                    <small>{flight.to.city}</small>
                  </div>
                </div>

                <div className="flight-times">
                  <div>
                    <span>Departs</span>
                    <strong>{formatTime(flight.departure)}</strong>
                    <small>{formatDate(flight.departure)} · local departure time</small>
                  </div>
                  <div>
                    <span>Arrives</span>
                    <strong>{formatTime(flight.arrival)}</strong>
                    <small>{formatDate(flight.arrival)} · local arrival time</small>
                  </div>
                </div>

                <div className="flight-footer">
                  <div>
                    <span className="label">Fare</span>
                    <strong>${flight.price}</strong>
                  </div>
                  <span className={`flight-availability ${flight.seatsLeft === 0 ? 'sold-out' : ''}`}>
                    {flight.seatsLeft === 0 ? noFreeSeatsMessage : 'Available to book'}
                  </span>
                </div>
              </button>
            )
          }) : (
            <p className="empty-flights">No matching flights. Change your search and try again.</p>
          )}
        </div>
      </section>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null)
        }}>
          <section className={`action-modal ${modal === 'admin' ? 'admin-modal' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading">
              {['trips', 'offers', 'support'].includes(modal) && (
                <img className="modal-host" src="/skyjet-travel-host.png" alt="EmiKettik travel host" />
              )}
              <div>
                <p className="section-kicker">EmiKettik services</p>
                <h2 id="modal-title">
                  {modal === 'booking' && 'Book your flight'}
                  {modal === 'trips' && 'Your trips'}
                  {modal === 'offers' && 'Current offers'}
                  {modal === 'support' && 'Contact support'}
                  {modal === 'country' && activeCountry?.name}
                  {modal === 'admin' && 'Flight history'}
                </h2>
              </div>
              <button className="modal-close" type="button" aria-label="Close" onClick={() => setModal(null)}>
                ×
              </button>
            </div>

            {actionError && <p className="form-message error" role="alert">{actionError}</p>}
            {actionMessage && <p className="form-message success" role="status">{actionMessage}</p>}

            {modal === 'country' && activeCountry && (
              <div className="country-detail">
                <div className={`country-detail-banner ${activeCountry.style}`}>
                  <img className="country-detail-image" src={activeCountry.image} alt={`${activeCountry.name} scenery`} />
                  <span className="explore-tag">Explore destinations</span>
                  <p>{activeCountry.description}</p>
                </div>
                <div className="country-city-list">
                  {activeCountry.cityCodes.map((code) => {
                    const city = cities.find((item) => item.code === code)
                    if (!city) return null
                    const isActive = activeCityCode === city.code
                    return (
                      <button
                        key={city.code}
                        type="button"
                        className={`country-city-button ${isActive ? 'active' : ''}`}
                        onClick={() => chooseCity(city.code)}
                      >
                        <span><strong>{city.city}</strong><small>{city.description}</small></span>
                        <span className="country-city-code">{city.code} {isActive ? '−' : '+'}</span>
                      </button>
                    )
                  })}
                </div>

                {activeCity && (
                  <div className="city-route-panel">
                    <div className="city-routes-heading">
                      <h3>Flights serving {activeCity.city}</h3>
                      <span>{activeCityFlights.length} {activeCityFlights.length === 1 ? 'flight' : 'flights'}</span>
                    </div>
                    {activeCityFlights.length ? (
                      <div className="city-route-list">
                        {activeCityFlights.map((flight) => (
                          <article className="city-route" key={flight.id}>
                            <div className="city-route-main">
                              <strong>Flight {flight.id} · {flight.from.city} → {flight.to.city}</strong>
                              <small>{flight.airline} · Departs {formatDate(flight.departure)} at {formatTime(flight.departure)} · Arrives {formatTime(flight.arrival)}</small>
                            </div>
                            <div className="city-route-booking">
                              <strong>${flight.price}</strong>
                              {flight.seatsLeft === 0 && (
                                <span className="seat-status sold-out">{noFreeSeatsMessage}</span>
                              )}
                              <button type="button" className="secondary-button" onClick={() => chooseCityFlight(flight)}>
                                View flight
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-state">There are no scheduled flights to this city yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {modal === 'admin' && (
              !adminToken ? (
                <form className="action-form" onSubmit={handleAdminLogin}>
                  <p className="modal-description">
                    Enter the demo admin code to view flight and booking history.
                  </p>
                  {adminError && <p className="form-message error" role="alert">{adminError}</p>}
                  <label>
                    Admin code
                    <input
                      required
                      type="password"
                      inputMode="numeric"
                      autoComplete="current-password"
                      value={adminCode}
                      onChange={(event) => setAdminCode(event.target.value)}
                    />
                  </label>
                  <p className="fine-print">Demo admin access is for local testing only.</p>
                  <button className="primary-button full-width" disabled={adminLoading}>
                    {adminLoading ? 'Checking code…' : 'Open admin history'}
                  </button>
                </form>
              ) : (
              <div className="admin-content">
                <p className="admin-demo-note">
                  Demo admin access only. The default code is for local testing and is not secure for production.
                </p>
                {adminError && <p className="form-message error" role="alert">{adminError}</p>}
                <div className="admin-toolbar">
                  <p>{adminFlights.length} total flights · {adminFlights.reduce((sum, flight) => sum + flight.bookingCount, 0)} bookings</p>
                  <label>
                    Status
                    <select value={adminFilter} onChange={(event) => setAdminFilter(event.target.value as typeof adminFilter)}>
                      <option>All</option>
                      <option value="Scheduled">Scheduled ({adminFlights.filter((flight) => flight.status === 'Scheduled').length})</option>
                      <option value="Flying now">Flying now ({adminFlights.filter((flight) => flight.status === 'Flying now').length})</option>
                      <option value="Completed">Completed ({adminFlights.filter((flight) => flight.status === 'Completed').length})</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => adminToken && loadAdminHistory(adminToken)}
                    disabled={adminLoading}
                  >
                    {adminLoading ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>
                <p className="finance-note">
                  Airline payouts are 80% of collected fares. EmiKettik profit is the remaining 20%, before operating costs.
                </p>
                <div className="admin-finance-grid" aria-label="Booking revenue summary">
                  <article className="admin-finance-card">
                    <span>Gross ticket sales</span>
                    <strong>{formatMoney(adminTotals.grossSales)}</strong>
                  </article>
                  <article className="admin-finance-card discount">
                    <span>Discounts given</span>
                    <strong>{formatMoney(adminTotals.discounts)}</strong>
                  </article>
                  <article className="admin-finance-card">
                    <span>Collected after discounts</span>
                    <strong>{formatMoney(adminTotals.revenue)}</strong>
                  </article>
                  <article className="admin-finance-card payout">
                    <span>Airline payouts</span>
                    <strong>{formatMoney(adminTotals.airlinePayout)}</strong>
                  </article>
                  <article className="admin-finance-card profit">
                    <span>EmiKettik profit</span>
                    <strong>{formatMoney(adminTotals.companyProfit)}</strong>
                  </article>
                </div>
                {adminLoading ? (
                  <p className="empty-state">Loading flight history…</p>
                ) : filteredAdminFlights.length ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Flight</th>
                          <th>Route</th>
                          <th>Departure</th>
                          <th>Status</th>
                          <th>Bookings</th>
                          <th>Collected</th>
                          <th>Discounts</th>
                          <th>Airline payout</th>
                          <th>Seats left</th>
                          <th>Fare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAdminFlights.map((flight) => (
                          <tr key={flight.id}>
                            <td><strong>{flight.id}</strong><small>{flight.airline} · {flight.aircraft}</small></td>
                            <td>{flight.from.airport} → {flight.to.airport}<small>{flight.from.city} to {flight.to.city}</small></td>
                            <td>{formatDate(flight.departure)}<small>{formatTime(flight.departure)}</small></td>
                            <td><span className={`admin-status ${flight.status.toLowerCase().replace(' ', '-')}`}>{flight.status}</span></td>
                            <td>{flight.bookingCount}<small>{flight.bookedTravelers} travelers</small></td>
                            <td>{formatMoney(flight.revenue)}</td>
                            <td>{formatMoney(flight.discounts)}</td>
                            <td>{formatMoney(flight.airlinePayout)}</td>
                            <td>{flight.seatsLeft} / {flight.seatsTotal}</td>
                            <td>${flight.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="empty-state">{adminError ? 'Flight history could not be loaded.' : 'No flights found for this status.'}</p>
                )}
                <div className="admin-airline-payouts">
                  <div className="city-routes-heading">
                    <h3>Airline settlement totals</h3>
                    <span>{airlineTotals.length} airlines</span>
                  </div>
                  {airlineTotals.length ? (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Airline</th>
                            <th>Collected fares</th>
                            <th>Payable to airline (80%)</th>
                            <th>EmiKettik profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {airlineTotals.map((airline) => (
                            <tr key={airline.airline}>
                              <td><strong>{airline.airline}</strong></td>
                              <td>{formatMoney(airline.revenue)}</td>
                              <td>{formatMoney(airline.airlinePayout)}</td>
                              <td>{formatMoney(airline.companyProfit)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="empty-state">Airline settlements appear after bookings are made.</p>
                  )}
                </div>
                <div className="admin-booking-history">
                  <div className="city-routes-heading">
                    <h3>Booking history</h3>
                    <span>{adminBookings.length} bookings</span>
                  </div>
                  <form className="admin-toolbar admin-delete-form" onSubmit={handleDeleteBookingsByEmail}>
                    <label>
                      Delete by email
                      <input
                        type="email"
                        required
                        placeholder="name@gmail.com"
                        value={deleteEmail}
                        onChange={(event) => setDeleteEmail(event.target.value)}
                      />
                    </label>
                    <button type="submit" className="secondary-button danger-button" disabled={adminLoading || !deleteEmail.trim()}>
                      Delete bookings
                    </button>
                  </form>
                  {deleteMessage && <p className="form-message success" role="status">{deleteMessage}</p>}
                  {adminBookings.length ? (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Passenger</th>
                            <th>Flight</th>
                            <th>Aircraft</th>
                            <th>Travelers</th>
                            <th>Seats</th>
                            <th>Gross</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th>Airline payout</th>
                            <th>EmiKettik profit</th>
                            <th>Booked</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminBookings.map((booking) => (
                            <tr key={booking.id}>
                              <td><strong>{booking.reference}</strong><small>{booking.status}</small></td>
                              <td><strong>{booking.passengerName}</strong><small>{booking.email}</small></td>
                              <td><strong>{booking.flight.id}</strong><small>{booking.flight.from.airport} → {booking.flight.to.airport}</small></td>
                              <td>{booking.flight.aircraft}<small>{booking.flight.airline}</small></td>
                              <td>{booking.travelers}</td>
                              <td>{booking.seats?.join(', ') || '—'}</td>
                              <td>{formatMoney(booking.grossSales)}</td>
                              <td>{formatMoney(booking.discounts)}</td>
                              <td>{formatMoney(booking.totalPrice)}</td>
                              <td>{formatMoney(booking.airlinePayout)}</td>
                              <td>{formatMoney(booking.companyProfit)}</td>
                              <td>{new Date(booking.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="empty-state">
                      {adminLoading ? 'Loading booking history…' : 'No bookings have been made yet.'}
                    </p>
                  )}
                </div>
              </div>
              )
            )}

            {modal === 'booking' && (
              confirmedBooking ? (
                <div className="booking-confirmation" role="status">
                  <div className="confirmation-icon" aria-hidden="true">✓</div>
                  <p className="section-kicker">Booking confirmed</p>
                  <h3>You’re ready to fly, {confirmedBooking.passengerName.split(' ')[0]}.</h3>
                  <p className="confirmation-reference">
                    Booking reference <strong>{confirmedBooking.reference}</strong>
                  </p>
                  <div className="confirmation-flight">
                    <div className="confirmation-flight-heading">
                      <div>
                        <span>Flight ID</span>
                        <strong>{confirmedBooking.flightId}</strong>
                      </div>
                      <span className="seat-pill">{confirmedBooking.flight.airline} · {confirmedBooking.flight.aircraft}</span>
                    </div>
                    <div className="confirmation-route">
                      <div>
                        <strong>{confirmedBooking.flight.from.city}</strong>
                        <span>{confirmedBooking.flight.from.airport}</span>
                      </div>
                      <span aria-hidden="true">→</span>
                      <div>
                        <strong>{confirmedBooking.flight.to.city}</strong>
                        <span>{confirmedBooking.flight.to.airport}</span>
                      </div>
                    </div>
                    <div className="confirmation-times">
                      <div>
                        <span>Departure</span>
                        <strong>{formatDate(confirmedBooking.flight.departure)}</strong>
                        <strong>{formatTime(confirmedBooking.flight.departure)}</strong>
                      </div>
                      <div>
                        <span>Arrival</span>
                        <strong>{formatDate(confirmedBooking.flight.arrival)}</strong>
                        <strong>{formatTime(confirmedBooking.flight.arrival)}</strong>
                      </div>
                    </div>
                    <div className="confirmation-seats">
                      <span>Seats</span>
                      <strong>{confirmedBooking.seats.join(', ')}</strong>
                    </div>
                  </div>
                  <div className="confirmation-total">
                    <span>{confirmedBooking.travelers} traveler{confirmedBooking.travelers === 1 ? '' : 's'}{confirmedBooking.offerCode ? ` · ${confirmedBooking.offerCode} applied` : ''}</span>
                    <strong>Total ${confirmedBooking.totalPrice}</strong>
                  </div>
                  <p className="fine-print">A copy of this demo confirmation is saved under Trips for {bookingEmail}.</p>
                  <button type="button" className="primary-button full-width" onClick={() => setModal(null)}>Done</button>
                </div>
              ) : (
                <form className="action-form" onSubmit={handleBooking}>
                  {selectedFlight && (
                    <div className="modal-flight-summary">
                      <strong>{selectedFlight.from.city} → {selectedFlight.to.city}</strong>
                      <span>{selectedFlight.airline} · {selectedFlight.aircraft} · {formatDate(selectedFlight.departure)} · {formatTime(selectedFlight.departure)} to {formatTime(selectedFlight.arrival)}</span>
                    </div>
                  )}
                  <label>
                    Passenger full name
                    <input required maxLength={120} autoComplete="name" value={passengerName} onChange={(event) => setPassengerName(event.target.value)} />
                  </label>
                  <label>
                    Email address
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      title="Enter an email address like name@example.com."
                      value={bookingEmail}
                      onChange={(event) => handleBookingEmailChange(event.target.value)}
                    />
                  </label>
                  <label>
                    Travelers
                    <select
                      value={travelers}
                      disabled={!selectedFlight || selectedFlight.seatsLeft === 0}
                      onChange={(event) => {
                        setTravelers(Number(event.target.value))
                        setSelectedSeats([])
                      }}
                    >
                      {Array.from({ length: Math.max(1, Math.min(9, selectedFlight?.seatsLeft ?? 1)) }, (_, index) => index + 1).map((count) => (
                        <option key={count} value={count}>{count} {count === 1 ? 'traveler' : 'travelers'}</option>
                      ))}
                    </select>
                  </label>
                  {selectedFlight?.seatsLeft === 0 && (
                    <p className="seat-status sold-out">{noFreeSeatsMessage}</p>
                  )}
                  {selectedFlight && selectedFlight.seatsLeft > 0 && (
                    <SeatPicker
                      flight={selectedFlight}
                      travelers={travelers}
                      selectedSeats={selectedSeats}
                      onToggle={toggleSeat}
                    />
                  )}
                  <label>
                    Offer code <span className="optional-label">optional</span>
                    <input maxLength={30} value={offerCode} onChange={(event) => setOfferCode(event.target.value)} placeholder="e.g. CITY10" />
                  </label>
                  <button
                    className="primary-button full-width"
                    disabled={isSubmitting || !selectedFlight || selectedFlight.seatsLeft === 0 || selectedSeats.length !== travelers}
                  >
                    {isSubmitting ? 'Confirming booking…' : 'Confirm booking'}
                  </button>
                  <p className="fine-print">Demo booking only. No payment is collected.</p>
                </form>
              )
            )}

            {modal === 'trips' && (
              <>
                <form className="action-form" onSubmit={handleTripLookup}>
                  <p className="modal-description">Enter the email used for your booking to find your saved trips.</p>
                  <label>
                    Email address
                    <input required type="email" autoComplete="email" value={tripEmail} onChange={(event) => setTripEmail(event.target.value)} />
                  </label>
                  <button className="primary-button full-width" disabled={isSubmitting}>
                    {isSubmitting ? 'Looking up…' : 'Find my trips'}
                  </button>
                </form>
                {trips && (
                  trips.length ? (
                    <div className="trip-results">
                      {trips.map((trip) => (
                        <article className="trip-result" key={trip.id}>
                          <div>
                          <strong>Flight {trip.flight.id} · {trip.flight.from.city} → {trip.flight.to.city}</strong>
                          <span>{trip.flight.airline} · {trip.flight.aircraft}</span>
                          <span>{formatDate(trip.flight.departure)} · {trip.travelers} traveler{trip.travelers === 1 ? '' : 's'}</span>
                          {trip.seats?.length ? <span>Seats {trip.seats.join(', ')}</span> : null}
                          </div>
                          <div className="trip-reference">
                            <span>Ref. {trip.reference}</span>
                            <strong>${trip.totalPrice}</strong>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : <p className="empty-state">No trips found for that email.</p>
                )}
              </>
            )}

            {modal === 'offers' && (
              <div className="offer-list">
                {offers.map((offer) => (
                  <article className="offer-result" key={offer.id}>
                    <div>
                      <span className="offer-discount">{offer.discountPercent}% OFF</span>
                      <h3>{offer.title}</h3>
                      <p>{offer.description}</p>
                      <small>Valid through {offer.expiresAt}</small>
                    </div>
                    <div className="offer-action">
                      <code>{offer.code}</code>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setOfferCode(offer.code)
                          setConfirmedBooking(null)
                          setActionMessage('')
                          setActionError('')
                          setModal('booking')
                        }}
                      >
                        Use offer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {modal === 'support' && (
              <form className="action-form" onSubmit={handleSupportRequest}>
                <p className="modal-description">Send our team a message and we’ll follow up at your email.</p>
                <label>
                  Your name
                  <input required maxLength={120} value={supportName} onChange={(event) => setSupportName(event.target.value)} />
                </label>
                <label>
                  Email address
                  <input required type="email" autoComplete="email" value={supportEmail} onChange={(event) => setSupportEmail(event.target.value)} />
                </label>
                <label>
                  Topic
                  <select value={supportTopic} onChange={(event) => setSupportTopic(event.target.value)}>
                    <option>Booking</option>
                    <option>Change or cancellation</option>
                    <option>Baggage</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  Message
                  <textarea required maxLength={2000} rows={4} value={supportMessage} onChange={(event) => setSupportMessage(event.target.value)} />
                </label>
                <button className="primary-button full-width" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App
