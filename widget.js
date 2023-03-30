import module from './module.js'
import { showModal } from './modal.js'

// In our widget we have rows we want to animate.
// To keep performance tight, we'll transform the row
// the length of the first child, remove it and restart
function animate({ target }) {
  // width of the first child
  const { offsetWidth } = target.firstElementChild
  // calculate styles of the row for getting access to values
  const styles = getComputedStyle(target)

  // get the speed of the current row
  const speed = parseFloat(
    styles.getPropertyValue('--speed')
  )

  // account for the gap between items in the row
  const gap = parseFloat(
    styles.getPropertyValue('gap')
  )

  // calculate width
  const width = offsetWidth + gap

  // calculate duration
  const duration = width / speed * 1000

  // set how far we want to transform our row
  target.style.setProperty(
    '--first-child-width',
    width + 'px'
  )

  // set how long our duration should last
  target.style.setProperty(
    '--duration',
    duration + 'ms'
  )

  // go time
  target.classList.add('run')
}

// after the row has transitioned, we need to do some cleanup
function iterate(event) {
  // transition is over
  event.target.classList.remove('run')
  // move the first item to the end
  event.target.appendChild(event.target.firstElementChild)

  // restart the process
  animate(event)
}

// this is my helper library, for scoping components
// think react meets jQuery
// docs: https://tylerchilds.com/tag/examples
const $ = module('.sliding-pills')

// delegate click events on the pill buttons in this scope
$.when('click', '.pill', (event) => {
  // using the dataset-id as a key for looking up metadata
  const { id } = event.target.dataset
  // open a modal with some content
  showModal(modalById(id))
})

// delegate transition events for the rows
$.when('transitionstart', '.sliding-pills__row', animate)
$.when('transitionend', '.sliding-pills__row', iterate)

// scope some styles, the & is .sliding-pills in this scenario
$.flair(`
  & .sliding-pills__row {
    --speed: 25;
    transform: translateX(0);
  }

  & .sliding-pills__row:nth-child(even) {
    --speed: 50;
  }

  & .sliding-pills__row.run {
    transition: transform linear var(--duration);
    transform: translateX(calc(-1 * var(--first-child-width)));
  }
`)

// manually kick off the animate function for each row to start
const elems = document.querySelectorAll('.sliding-pills__row')
elems.forEach(target => animate({ target }))

// get modal html by id
function modalById(id) {
  const metadata = {
    bigquery: {
      name: 'BigQuery',
      icon: 'assets/bigquery.svg'
    },
    couchdb: {
      name: 'CouchDB',
      icon: 'assets/couchdb.svg'
    },
    'google-sheets': {
      name: 'Google Sheets',
      icon: 'assets/google-sheets.svg'
    },
    jira: {
      name: 'Jira',
      icon: 'assets/jira.svg'
    },
    mongodb: {
      name: 'MongoDB',
      icon: 'assets/mongodb.svg'
    },
    oracle: {
      name: 'Oracle',
      icon: 'assets/oracle.svg'
    },
    postgresql: {
      name: 'PostgreSQL',
      icon: 'assets/postgresql.svg'
    },
    salesforce: {
      name: 'Salesforce',
      icon: 'assets/salesforce.svg'
    },
    snowflake: {
      name: 'Snowflake',
      icon: 'assets/snowflake.svg'
    },
    stripe: {
      name: 'Stripe',
      icon: 'assets/stripe.svg'
    },
    twilio: {
      name: 'Twilio',
      icon: 'assets/twilio.svg'
    }
  }

  const data = metadata[id] || {}

  return `
    <div class="integration">
      <img class="integration__icon" src="${data.icon}" alt="icon for ${data.name}" />
      <div>
        <div class="integration__header">
          Build internal tools with ${data.name}
        </div>
        <div class="integration__body">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
  `
}
