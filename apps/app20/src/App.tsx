import { useState } from 'react'
import { PEOPLE, Person } from './data/people'
import './index.css'

function PersonCard({ person }: { person: Person }) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('bio')

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section)
  }

  return (
    <div className="person-card card">
      <div className="person-header">
        <img src={person.image} alt={person.name} className="person-image" />
        <div className="person-info">
          <h2>{person.name}</h2>
          <p className="person-title">{person.title}</p>
          <p className="person-lifespan">{person.lifespan}</p>
        </div>
      </div>

      <div className="quote">
        <span className="quote-mark">"</span>
        <p>{person.quote}</p>
      </div>

      <div className="accordions">
        <div className="accordion">
          <button
            className="accordion-trigger"
            onClick={() => toggleAccordion('bio')}
          >
            <span>Biography</span>
            <span className={`chevron ${activeAccordion === 'bio' ? 'open' : ''}`}>⌄</span>
          </button>
          {activeAccordion === 'bio' && (
            <div className="accordion-content">
              <p>{person.bio}</p>
            </div>
          )}
        </div>

        <div className="accordion">
          <button
            className="accordion-trigger"
            onClick={() => toggleAccordion('achievements')}
          >
            <span>Key Achievements</span>
            <span className={`chevron ${activeAccordion === 'achievements' ? 'open' : ''}`}>⌄</span>
          </button>
          {activeAccordion === 'achievements' && (
            <div className="accordion-content">
              <ul className="achievements-list">
                {person.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="accordion">
          <button
            className="accordion-trigger"
            onClick={() => toggleAccordion('timeline')}
          >
            <span>Timeline</span>
            <span className={`chevron ${activeAccordion === 'timeline' ? 'open' : ''}`}>⌄</span>
          </button>
          {activeAccordion === 'timeline' && (
            <div className="accordion-content">
              <div className="timeline">
                {person.timeline.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <span className="timeline-year">{item.year}</span>
                    <span className="timeline-event">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="accordion">
          <button
            className="accordion-trigger"
            onClick={() => toggleAccordion('gallery')}
          >
            <span>Gallery</span>
            <span className={`chevron ${activeAccordion === 'gallery' ? 'open' : ''}`}>⌄</span>
          </button>
          {activeAccordion === 'gallery' && (
            <div className="accordion-content">
              <div className="gallery">
                {person.gallery.map((img, i) => (
                  <div key={i} className="gallery-item">
                    <img src={img.url} alt={img.caption} />
                    <p className="caption">{img.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>TributeWall</h1>
        <p className="subtitle">Celebrating Computing Pioneers</p>
      </header>

      <div className="people-grid">
        {PEOPLE.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>

      <footer className="footer">
        <p>Built with React • App 20</p>
      </footer>
    </div>
  )
}

export default App