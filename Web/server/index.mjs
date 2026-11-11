import { randomUUID, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001)
const host = process.env.HOST ?? (isProduction ? '0.0.0.0' : '127.0.0.1')
const adminCode = process.env.ADMIN_CODE ?? '12345'
const airlinePayoutRate = 0.8
const serverDirectory = dirname(fileURLToPath(import.meta.url))
const webDirectory = resolve(serverDirectory, '..', 'dist')
const dataDirectory = process.env.DATA_DIR ?? serverDirectory
const dataFile = join(dataDirectory, 'store.json')
const adminSessions = new Set()
const relativeFlightTime = (minutesFromNow) =>
  new Date(Date.now() + minutesFromNow * 60_000).toISOString()

if (isProduction && (!process.env.ADMIN_CODE || adminCode === '12345')) {
  throw new Error('Set a non-default ADMIN_CODE environment variable before running in production.')
}

const flights = [
  {
    id: 'sky-101',
    from: { city: 'Almaty', airport: 'ALA' },
    to: { city: 'Dubai', airport: 'DXB' },
    departure: '2026-11-12T08:30+05:00',
    arrival: '2026-11-12T12:20+04:00',
    airline: 'EmiKettik',
    aircraft: 'Airbus A321neo',
    price: 420,
    seatsTotal: 180,
    seatsTaken: ['12A', '3C', '19F', '22D'],
  },
  {
    id: 'sky-205',
    from: { city: 'Tashkent', airport: 'TAS' },
    to: { city: 'Istanbul', airport: 'IST' },
    departure: '2026-11-12T14:05+05:00',
    arrival: '2026-11-12T17:10+03:00',
    airline: 'AeroNomad',
    aircraft: 'Boeing 737-800',
    price: 310,
    seatsTotal: 160,
    seatsTaken: ['4B', '8E', '11A', '23C', '28F'],
  },
  {
    id: 'sky-318',
    from: { city: 'Moscow', airport: 'SVO' },
    to: { city: 'Bishkek', airport: 'FRU' },
    departure: '2026-11-13T06:15+03:00',
    arrival: '2026-11-13T09:45+06:00',
    airline: 'NomadAir',
    aircraft: 'Airbus A320',
    price: 260,
    seatsTotal: 150,
    seatsTaken: ['2D', '7A', '15C', '18F'],
  },
  {
    id: 'sky-441',
    from: { city: 'Novosibirsk', airport: 'NQZ' },
    to: { city: 'Dubai', airport: 'DXB' },
    departure: '2026-11-13T19:40+07:00',
    arrival: '2026-11-14T00:10+04:00',
    airline: 'EmiKettik',
    aircraft: 'Boeing 787-9',
    price: 490,
    seatsTotal: 200,
    seatsTaken: ['1A', '6D', '9C', '16E', '22F'],
  },
  {
    id: 'sky-102',
    from: { city: 'Almaty', airport: 'ALA' },
    to: { city: 'Dubai', airport: 'DXB' },
    departure: '2026-11-12T16:45+05:00',
    arrival: '2026-11-12T20:35+04:00',
    airline: 'EmiKettik',
    aircraft: 'Airbus A321neo',
    price: 395,
    seatsTotal: 180,
    seatsTaken: ['5A', '9C', '14D'],
  },
  {
    id: 'sky-206',
    from: { city: 'Almaty', airport: 'ALA' },
    to: { city: 'Istanbul', airport: 'IST' },
    departure: '2026-11-13T09:10+05:00',
    arrival: '2026-11-13T13:05+03:00',
    airline: 'AeroNomad',
    aircraft: 'Airbus A330-300',
    price: 365,
    seatsTotal: 250,
    seatsTaken: ['2A', '8C', '15F'],
  },
  {
    id: 'sky-319',
    from: { city: 'Tashkent', airport: 'TAS' },
    to: { city: 'Bishkek', airport: 'FRU' },
    departure: '2026-11-14T11:25+05:00',
    arrival: '2026-11-14T13:40+06:00',
    airline: 'NomadAir',
    aircraft: 'Embraer E190',
    price: 185,
    seatsTotal: 100,
    seatsTaken: ['4A', '8B'],
  },
  {
    id: 'sky-442',
    from: { city: 'Moscow', airport: 'SVO' },
    to: { city: 'Istanbul', airport: 'IST' },
    departure: '2026-11-15T07:50+03:00',
    arrival: '2026-11-15T11:55+03:00',
    airline: 'EmiKettik',
    aircraft: 'Boeing 737 MAX 8',
    price: 340,
    seatsTotal: 178,
    seatsTaken: ['6B', '12C', '19D'],
  },
  {
    id: 'sky-510',
    from: { city: 'Bishkek', airport: 'FRU' },
    to: { city: 'Tashkent', airport: 'TAS' },
    departure: '2026-11-15T15:20+06:00',
    arrival: '2026-11-15T15:35+05:00',
    airline: 'NomadAir',
    aircraft: 'Airbus A320neo',
    price: 205,
    seatsTotal: 150,
    seatsTaken: ['3C', '10A'],
  },
  {
    id: 'sky-620',
    from: { city: 'Novosibirsk', airport: 'NQZ' },
    to: { city: 'Moscow', airport: 'SVO' },
    departure: '2026-11-16T08:40+07:00',
    arrival: '2026-11-16T09:20+03:00',
    airline: 'AeroNomad',
    aircraft: 'Boeing 737-800',
    price: 285,
    seatsTotal: 160,
    seatsTaken: ['4D', '7F', '13A'],
  },
  {
    id: 'sky-701',
    from: { city: 'Almaty', airport: 'ALA' },
    to: { city: 'Istanbul', airport: 'IST' },
    departure: relativeFlightTime(-80),
    arrival: relativeFlightTime(100),
    airline: 'EmiKettik',
    aircraft: 'Airbus A321neo',
    price: 375,
    seatsTotal: 180,
    seatsTaken: ['2A', '8C', '15F', '21D'],
  },
  {
    id: 'sky-702',
    from: { city: 'Almaty', airport: 'ALA' },
    to: { city: 'Delhi', airport: 'DEL' },
    departure: relativeFlightTime(-90),
    arrival: relativeFlightTime(120),
    airline: 'EmiKettik',
    aircraft: 'Airbus A321neo',
    price: 340,
    seatsTotal: 180,
    seatsTaken: ['3A', '8C', '17F'],
  },
  {
    id: 'sky-703',
    from: { city: 'Tashkent', airport: 'TAS' },
    to: { city: 'Tokyo', airport: 'HND' },
    departure: relativeFlightTime(-110),
    arrival: relativeFlightTime(160),
    airline: 'AeroNomad',
    aircraft: 'Boeing 787-9',
    price: 615,
    seatsTotal: 250,
    seatsTaken: ['5A', '12C', '19F'],
  },
  {
    id: 'sky-704',
    from: { city: 'Dubai', airport: 'DXB' },
    to: { city: 'Bangkok', airport: 'BKK' },
    departure: relativeFlightTime(-45),
    arrival: relativeFlightTime(210),
    airline: 'EmiKettik',
    aircraft: 'Airbus A330-300',
    price: 530,
    seatsTotal: 260,
    seatsTaken: ['2D', '9A', '16C', '23F'],
  },
  {
    id: 'sky-699',
    from: { city: 'Dubai', airport: 'DXB' },
    to: { city: 'Moscow', airport: 'SVO' },
    departure: relativeFlightTime(-1500),
    arrival: relativeFlightTime(-1260),
    airline: 'AeroNomad',
    aircraft: 'Boeing 737-800',
    price: 455,
    seatsTotal: 160,
    seatsTaken: ['4D', '7F', '13A'],
  },
]

const offers = [
  {
    id: 'city-break',
    title: 'City break',
    description: 'Save 10% on selected city routes.',
    code: 'CITY10',
    discountPercent: 10,
    expiresAt: '2026-12-31',
  },
  {
    id: 'nomad-week',
    title: 'Nomad week',
    description: 'Save 15% on flights to Bishkek.',
    code: 'NOMAD15',
    discountPercent: 15,
    expiresAt: '2026-12-15',
  },
]

let store = { bookings: [], supportRequests: [] }
let writeQueue = Promise.resolve()

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function loadStore() {
  try {
    store = JSON.parse((await readFile(dataFile, 'utf8')).replace(/^\uFEFF/, ''))
    if (!Array.isArray(store.bookings) || !Array.isArray(store.supportRequests)) {
      throw new Error('Backend store has an invalid shape.')
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    await mkdir(dirname(dataFile), { recursive: true })
    await writeFile(dataFile, JSON.stringify(store, null, 2))
  }
}

function persistStore() {
  const snapshot = JSON.stringify(store, null, 2)
  writeQueue = writeQueue.then(() => writeFile(dataFile, snapshot))
  return writeQueue
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

async function serveWeb(request, response, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return sendJson(response, 404, { error: 'Page not found.' })
  }

  let decodedPath
  try {
    decodedPath = decodeURIComponent(pathname)
  } catch {
    return sendJson(response, 400, { error: 'Invalid URL path.' })
  }

  const filePath = resolve(webDirectory, `.${decodedPath}`)
  const relativePath = relative(webDirectory, filePath)
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    return sendJson(response, 404, { error: 'Page not found.' })
  }

  let content
  let contentPath = filePath
  try {
    content = await readFile(filePath)
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error
    if (extname(decodedPath)) return sendJson(response, 404, { error: 'Page not found.' })
    contentPath = join(webDirectory, 'index.html')
    content = await readFile(contentPath)
  }

  const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webmanifest': 'application/manifest+json',
  }
  response.writeHead(200, {
    'Content-Type': contentTypes[extname(contentPath)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  })
  response.end(request.method === 'HEAD' ? undefined : content)
}

async function readJson(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 16_384) throw new HttpError(413, 'Request body is too large.')
  }

  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.')
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new HttpError(400, 'Request body must be a JSON object.')
  }
  return parsed
}

function requiredText(value, label, maxLength) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > maxLength) {
    throw new HttpError(400, `${label} is required and must be at most ${maxLength} characters.`)
  }
  return value.trim()
}

function validEmail(value) {
  const email = requiredText(value, 'Email', 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new HttpError(400, 'Enter an email in the format name@example.com.')
  }
  return email.toLowerCase()
}

function codeMatches(candidate) {
  const actual = Buffer.from(candidate)
  const expected = Buffer.from(adminCode)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function requireAdmin(request) {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token || !adminSessions.has(token)) {
    throw new HttpError(401, 'Admin access required. Enter the admin code to continue.')
  }
}

function seatsAvailable(flight) {
  return Math.max(0, flight.seatsTotal - occupiedSeats(flight).length)
}

function seatNumber(index) {
  return `${Math.floor(index / 6) + 1}${String.fromCharCode(65 + (index % 6))}`
}

function occupiedSeats(flight) {
  const occupied = new Set(flight.seatsTaken)
  const bookings = store.bookings.filter((booking) => booking.flightId === flight.id)

  for (const booking of bookings) {
    if (Array.isArray(booking.seats) && booking.seats.length === booking.travelers) {
      booking.seats.forEach((seat) => occupied.add(seat))
      continue
    }

    for (let traveler = 0; traveler < booking.travelers; traveler += 1) {
      for (let index = 0; index < flight.seatsTotal; index += 1) {
        const seat = seatNumber(index)
        if (occupied.has(seat)) continue
        occupied.add(seat)
        break
      }
    }
  }

  return [...occupied]
}

function validSeatNumber(seat, flight) {
  if (typeof seat !== 'string') return false
  const match = /^(\d+)([A-F])$/.exec(seat)
  if (!match) return false
  const row = Number(match[1])
  const column = match[2].charCodeAt(0) - 65
  return row > 0 && (row - 1) * 6 + column < flight.seatsTotal
}

function flightResponse(flight) {
  return {
    ...flight,
    occupiedSeats: occupiedSeats(flight),
    seatsLeft: seatsAvailable(flight),
  }
}

function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

function bookingFinancials(booking, flight) {
  const grossSales = Number.isFinite(booking.grossSales)
    ? booking.grossSales
    : flight.price * booking.travelers
  const revenue = Number.isFinite(booking.totalPrice) ? booking.totalPrice : grossSales
  const discounts = Number.isFinite(booking.discountAmount)
    ? booking.discountAmount
    : Math.max(0, grossSales - revenue)
  const airlinePayout = Number.isFinite(booking.airlinePayout)
    ? booking.airlinePayout
    : roundMoney(revenue * airlinePayoutRate)
  const companyProfit = Number.isFinite(booking.companyProfit)
    ? booking.companyProfit
    : roundMoney(revenue - airlinePayout)

  return { grossSales, discounts, totalPrice: revenue, airlinePayout, companyProfit }
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`)
  const route = `${request.method} ${url.pathname}`

  if (route === 'GET /api/health') {
    return sendJson(response, 200, { status: 'ok' })
  }

  if (route === 'GET /api/flights') {
    return sendJson(response, 200, flights.map(flightResponse))
  }

  if (route === 'POST /api/admin/session') {
    const body = await readJson(request)
    if (typeof body.code !== 'string' || !codeMatches(body.code.trim())) {
      throw new HttpError(401, 'That admin code is incorrect.')
    }
    const token = randomUUID()
    adminSessions.add(token)
    return sendJson(response, 200, { token })
  }

  if (route === 'GET /api/admin/flights') {
    requireAdmin(request)
    const now = Date.now()
    const history = flights.map((flight) => {
      const bookings = store.bookings.filter((booking) => booking.flightId === flight.id)
      const financials = bookings
        .map((booking) => bookingFinancials(booking, flight))
        .reduce((totals, booking) => ({
          grossSales: roundMoney(totals.grossSales + booking.grossSales),
          discounts: roundMoney(totals.discounts + booking.discounts),
          revenue: roundMoney(totals.revenue + booking.totalPrice),
          airlinePayout: roundMoney(totals.airlinePayout + booking.airlinePayout),
          companyProfit: roundMoney(totals.companyProfit + booking.companyProfit),
        }), { grossSales: 0, discounts: 0, revenue: 0, airlinePayout: 0, companyProfit: 0 })
      const departure = new Date(flight.departure).getTime()
      const arrival = new Date(flight.arrival).getTime()

      return {
        ...flightResponse(flight),
        bookingCount: bookings.length,
        bookedTravelers: bookings.reduce((total, booking) => total + booking.travelers, 0),
        ...financials,
        status: now < departure ? 'Scheduled' : now < arrival ? 'Flying now' : 'Completed',
      }
    })
    return sendJson(response, 200, history)
  }

  if (route === 'GET /api/admin/bookings') {
    requireAdmin(request)
    const history = store.bookings
      .slice()
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((booking) => {
        const flight = flights.find((item) => item.id === booking.flightId)
        if (!flight) throw new Error(`Booking ${booking.reference} references unknown flight ${booking.flightId}.`)
        return { ...booking, ...bookingFinancials(booking, flight), flight: flightResponse(flight) }
      })
    return sendJson(response, 200, history)
  }

  if (route === 'DELETE /api/admin/bookings') {
    requireAdmin(request)
    const email = validEmail(url.searchParams.get('email'))
    const remaining = store.bookings.filter((booking) => booking.email !== email)
    const deleted = store.bookings.length - remaining.length
    if (deleted === 0) throw new HttpError(404, `No bookings found for ${email}.`)
    store.bookings = remaining
    await persistStore()
    return sendJson(response, 200, { email, deleted })
  }

  if (route === 'GET /api/offers') {
    return sendJson(response, 200, offers)
  }

  if (route === 'GET /api/trips') {
    const email = validEmail(url.searchParams.get('email'))
    const trips = store.bookings
      .filter((booking) => booking.email === email)
      .map((booking) => ({
        ...booking,
        ...bookingFinancials(booking, flights.find((flight) => flight.id === booking.flightId)),
        flight: flightResponse(flights.find((flight) => flight.id === booking.flightId)),
      }))
    return sendJson(response, 200, trips)
  }

  if (route === 'POST /api/bookings') {
    const body = await readJson(request)
    const flightId = requiredText(body.flightId, 'Flight', 50)
    const flight = flights.find((item) => item.id === flightId)
    if (!flight) throw new HttpError(404, 'That flight could not be found.')

    const passengerName = requiredText(body.passengerName, 'Passenger name', 120)
    const email = validEmail(body.email)
    const travelers = Number(body.travelers)
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 9) {
      throw new HttpError(400, 'Choose between 1 and 9 travelers.')
    }
    if (travelers > seatsAvailable(flight)) {
      throw new HttpError(409, 'There are not enough seats left for this flight.')
    }
    if (!Array.isArray(body.seats) || body.seats.length !== travelers || body.seats.some((seat) => !validSeatNumber(seat, flight))) {
      throw new HttpError(400, 'Choose one valid seat for each traveler.')
    }
    if (new Set(body.seats).size !== body.seats.length) {
      throw new HttpError(400, 'Each traveler must have a different seat.')
    }
    const occupied = new Set(occupiedSeats(flight))
    if (body.seats.some((seat) => occupied.has(seat))) {
      throw new HttpError(409, 'One or more selected seats have just been booked. Choose different seats.')
    }
    const offerCode = typeof body.offerCode === 'string' ? body.offerCode.trim().toUpperCase() : ''
    const offer = offerCode ? offers.find((item) => item.code === offerCode) : null
    if (offerCode && !offer) throw new HttpError(400, 'That offer code is not valid.')
    if (offer && offer.expiresAt < new Date().toISOString().slice(0, 10)) {
      throw new HttpError(400, 'That offer has expired.')
    }
    if (offer?.code === 'NOMAD15' && flight.to.airport !== 'FRU') {
      throw new HttpError(400, 'NOMAD15 is only valid on flights to Bishkek.')
    }

    const grossSales = flight.price * travelers
    const totalPrice = Math.round(grossSales * (1 - (offer?.discountPercent ?? 0) / 100))
    const airlinePayout = roundMoney(totalPrice * airlinePayoutRate)
    const booking = {
      id: randomUUID(),
      reference: randomUUID().slice(0, 8).toUpperCase(),
      flightId,
      passengerName,
      email,
      travelers,
      seats: body.seats,
      offerCode: offer?.code ?? null,
      grossSales,
      discounts: grossSales - totalPrice,
      totalPrice,
      airlinePayout,
      companyProfit: roundMoney(totalPrice - airlinePayout),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    store.bookings.push(booking)
    await persistStore()
    return sendJson(response, 201, {
      ...booking,
      flight: flightResponse(flight),
    })
  }

  if (route === 'POST /api/support') {
    const body = await readJson(request)
    const ticket = {
      id: randomUUID(),
      name: requiredText(body.name, 'Name', 120),
      email: validEmail(body.email),
      topic: requiredText(body.topic, 'Topic', 80),
      message: requiredText(body.message, 'Message', 2000),
      status: 'received',
      createdAt: new Date().toISOString(),
    }
    store.supportRequests.push(ticket)
    await persistStore()
    return sendJson(response, 201, {
      ticketId: ticket.id,
      status: ticket.status,
      message: 'Your message has been received. Our support team will follow up by email.',
    })
  }

  throw new HttpError(404, 'API endpoint not found.')
}

await loadStore()

createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`)
  const handler = isProduction && !url.pathname.startsWith('/api/')
    ? serveWeb(request, response, url.pathname)
    : handleRequest(request, response)
  handler.catch((error) => {
    const status = error instanceof HttpError ? error.status : 500
    if (status === 500) console.error('API request failed:', error)
    if (!response.headersSent) {
      sendJson(response, status, {
        error: status === 500 ? 'Internal server error.' : error.message,
      })
    } else {
      response.destroy(error)
    }
  })
}).listen(port, host, () => {
  console.log(`EmiKettik server listening on http://${host}:${port}`)
})
