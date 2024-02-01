import dayjs from 'dayjs'
import Calender from './components/calendar'

function App() {
  return (
    <>
      <Calender
        value={dayjs('2023-11-08')}
        className={'aaa'}
        style={{ background: 'yellow' }}
        locale="en-US"
        dateRender={(value) => {
          return (
            <div>
              <p style={{ background: 'yellowgreen', height: '50px' }}>
                {value.format('YYYY/MM/DD')}
              </p>
            </div>
          )
        }}
        onChange={(date) => {
          alert(date.format('YYYY-MM-DD'))
        }}
      ></Calender>
    </>
  )
}

export default App
