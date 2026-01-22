// MILESTONE 1
type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

// MILESTONE 2
type ActressNationality =
  | 'American'
  | 'British'
  | 'Australian'
  | 'Israeli-American'
  | 'South African'
  | 'French'
  | 'Indian'
  | 'Israeli'
  | 'Spanish'
  | 'South Korean'
  | 'Chinese'

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
}

// MILESTONE 3
function isPerson(dati: unknown): dati is Person {
  return (
    typeof dati === 'object' && dati !== null &&
    'id' in dati && typeof dati.id === 'number' &&
    'name' in dati && typeof dati.name === 'string' &&
    'birth_year' in dati && typeof dati.birth_year === 'number' &&
    'biography' in dati && typeof dati.biography === 'string' &&
    'image' in dati && typeof dati.image === 'string'
  )
}

const actressesNationalities = ['American', 'British', 'Australian', 'Israeli-American', 'South African', 'French', 'Indian', 'Israeli', 'Spanish', 'South Korean', 'Chinese']

function isActress(dati: unknown): dati is Actress {
  return (
    isPerson(dati) &&
    'most_famous_movies' in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(movie => typeof movie === 'string') &&
    'awards' in dati && typeof dati.awards === 'string' &&
    'nationality' in dati && typeof dati.nationality === 'string' &&
    actressesNationalities.includes(dati.nationality)
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`)
    const data: unknown = await response.json()
    if (!isActress(data)) {
      throw new Error('Formato dei dati non valido')
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel recupero dell\'attrice: ', error)
    }
    else {
      console.error('Errore sconosciuto: ', error)
    }
    return null;
  }
}

// MILESTONE 4
async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch('http://localhost:3333/actresses')
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    const data: unknown = await response.json()
    if (!(data instanceof Array)) {
      throw new Error('Formato dei dati non valido')
    }
    const filteredActresses: Actress[] = data.filter(actress => isActress(actress))
    return filteredActresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel recupero delle attrici', error)
    }
    else {
      console.error('Errore sconosciuto', error)
    }
    return [];
  }
}

// MILESTONE 5
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id))
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel recupero delle attrici: ', error)
    }
    else {
      console.error('Errore sconosciuto ', error)
    }
    return [];
  }
}

// BONUS 1
function createActress(dati: Omit<Actress, 'id'>): Actress {
  return (
    {
      ...dati,
      id: Math.floor(Math.random() * 1000)
    }
  )
}

function updateActress(actress: Actress, updates: Partial<Actress>): Actress {
  return (
    {
      ...actress,
      ...updates,
      id: actress.id,
      name: actress.name
    }
  )
}

// BONUS 2
type ActorNationality =
  | ActressNationality
  | 'Scottish'
  | 'New Zealand'
  | 'Hong Kong'
  | 'German'
  | 'Canadian'
  | 'Irish'

const actorsNationalities = ['American', 'British', 'Australian', 'Israeli-American', 'South African', 'French', 'Indian', 'Israeli', 'Spanish', 'South Korean', 'Chinese', 'Scottish', 'New Zealand', 'Hong Kong', 'German', 'Canadian', 'Irish']

type Actor = Person & {
  known_for: [string, string, string],
  awards: [string] | [string, string],
  nationality: ActorNationality
}

function isActor(dati: unknown): dati is Actor {
  return (
    isPerson(dati) &&
    'known_for' in dati &&
    dati.known_for instanceof Array &&
    dati.known_for.length === 3 &&
    dati.known_for.every(movie => typeof movie === 'string') &&
    'awards' in dati && dati.awards instanceof Array &&
    (dati.awards.length === 1 || dati.awards.length === 2) &&
    dati.awards.every(award => typeof award === 'string') &&
    'nationality' in dati && typeof dati.nationality === 'string' &&
    actorsNationalities.includes(dati.nationality)
  )
}

async function getActor(id: number): Promise<Actor | null> {
  try {
    const response = await fetch(`http://localhost:3333/actors/${id}`)
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    const data: unknown = await response.json()
    if (!isActor(data)) {
      throw new Error('Formato dei dati non valido')
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel recupero dell\'attore: ', error)
    }
    else {
      console.error('Errore sconosciuto: ', error)
    }
    return null;
  }
}

async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch('http://localhost:3333/actors')
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    const data: unknown = await response.json()
    if (!(data instanceof Array)) {
      throw new Error('Formato dei dati non valido')
    }
    const filteredActors = data.filter(actor => isActor(actor))
    return filteredActors;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel recupero dell\'attore: ', error)
    }
    else {
      console.error('Errore sconosciuto: ', error)
    }
    return [];
  }
}

async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = ids.map(id => getActor(id))
    return await Promise.all(promises)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel recupero delgli attori: ', error)
    }
    else {
      console.error('Errore sconosciuto: ', error)
    }
    return [];
  }
}

function createActor(dati: Omit<Actor, 'id'>): Actor {
  return (
    {
      ...dati,
      id: Math.floor(Math.random() * 1000)
    }
  )
}

function updateActor(actor: Actor, updates: Partial<Actor>): Actor {
  return (
    {
      ...actor,
      ...updates,
      id: actor.id,
      name: actor.name
    }
  )
}

// BONUS 3
async function createRandomCouple(): Promise<[Actress, Actor] | null> {
  const [actresses, actors] = await Promise.all([getAllActresses(), getAllActors()])
  if (actresses.length === 0 || actors.length === 0) {
    return null;
  }
  const randomActress = actresses[Math.floor(Math.random() * actresses.length)]
  const randomActor = actors[Math.floor(Math.random() * actors.length)]
  return [randomActress, randomActor];
}

console.log(createRandomCouple())