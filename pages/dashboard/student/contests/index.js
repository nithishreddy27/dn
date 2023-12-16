import React,{useState} from 'react'
import EventList from '../../../../src/components/contests/EventList';
import EventDetails from '../../../../src/components/contests/EventDetails';



export const getServerSideProps = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/contests`);
    const status = await data.json();
    return {
      props: { contests: status },
    };
  };
  


const index = ({contests}) => {

    const [contest,setcontests] = useState(contests);
    console.log(contest);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectEvent = (event) => {
      setSelectedEvent(event);
    };

  return (
    <div className="flex mt-20">
    <EventList events={contest} onSelectEvent={handleSelectEvent} />
    <EventDetails selectedEvent={selectedEvent} />
  </div>
  )
}

export default index