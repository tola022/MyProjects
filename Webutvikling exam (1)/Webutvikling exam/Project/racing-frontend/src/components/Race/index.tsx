import React, { useState, useEffect } from 'react';

interface RaceStateType {
  id: number | null;
  winnerName: string;
  winnerTime: string;
  grandPrix: string;
  numberOfLaps: number;
}

const Races: React.FC = () => {
  const initialRaceState: RaceStateType = {
    id: null,
    winnerName: '',
    winnerTime: '',
    grandPrix: '',
    numberOfLaps: 0,
  };

  const [race, setRace] = useState<RaceStateType>(initialRaceState);
  const [races, setRaces] = useState<RaceStateType[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setRace({ ...race, [name]: value });
  };

  const handleAddUpdateRace = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (
      !race.winnerName ||
      !race.winnerTime ||
      !race.grandPrix ||
      !race.numberOfLaps
    ) {
      alert('Please fill in all fields');
      return;
    }

    let apiUrl = isUpdating
      ? `${process.env.REACT_APP_BACKEND_URL}/api/Race/Update`
      : `${process.env.REACT_APP_BACKEND_URL}/api/Race/Add`;

    const requestOptions: RequestInit = {
      method: isUpdating ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: race.id,
        winnerName: race.winnerName,
        winnerTime: race.winnerTime,
        grandPrix: race.grandPrix,
        numberOfLaps: race.numberOfLaps,
      }),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      console.log('data: ', data);

      if (response.ok) {
        if (isUpdating) {
          fetchRaces();
        } else {
          fetchRaces();
        }

        setRace(initialRaceState);
        setIsUpdating(false);
        const successMessage = isUpdating
          ? 'Race Updated successfully! '
          : 'New Race Added successfully! ';
        alert(successMessage);
      } else {
        alert('Error: Unable to add/update race');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Error: Unable to add/update race');
    }
  };

  const handleDeleteRace = async (id: number | null): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this race?')) {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/Race/Delete/${id}`;

      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await fetch(apiUrl, requestOptions);

        if (response.ok) {
          fetchRaces();
          alert('Race deleted successfully!');
        } else {
          alert('Error: Unable to delete race');
        }
      } catch (error) {
        console.error('API error:', error);
        alert('Error: Unable to delete race');
      }
    }
  };

  const handleUpdateRace = (id: number | null): void => {
    const selectedRace = races.find((item) => item.id === id);
    setRace(selectedRace || initialRaceState);
    setIsUpdating(true);
  };

  // Fetch all races when the component mounts
  const fetchRaces = async (): Promise<void> => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/Race/get`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setRaces(data.result);
      } else {
        console.error('Error fetching races:', data);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  useEffect(() => {
    // Fetch races again when a new race is added
    if (isUpdating) {
      fetchRaces();
    }
  }, [isUpdating]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h2 className="text-white">Add/Update Race</h2>
          <form onSubmit={handleAddUpdateRace}>
            <div className="mb-3">
              <label htmlFor="winnerName" className="form-label text-white">
                Winner Name
              </label>
              <input
                type="text"
                className="form-control"
                id="winnerName"
                name="winnerName"
                value={race.winnerName}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="winnerTime" className="form-label text-white">
                Winner Time
              </label>
              <input
                type="text"
                className="form-control"
                id="winnerTime"
                name="winnerTime"
                value={race.winnerTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="grandPrix" className="form-label text-white">
                Grand Prix
              </label>
              <input
                type="text"
                className="form-control"
                id="grandPrix"
                name="grandPrix"
                value={race.grandPrix}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="numberOfLaps" className="form-label text-white">
                Number of Laps
              </label>
              <input
                type="number"
                min={0}
                className="form-control"
                id="numberOfLaps"
                name="numberOfLaps"
                value={race.numberOfLaps}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isUpdating ? 'Update Race' : 'Add Race'}
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <h2 className="text-white">Race List</h2>
          <div className="list-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <ul className="list-group">
            {races.map((item) => (
              <li
                key={item.id || undefined}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className='d-flex flex-column'>
                <div>
                  <b>WinnerName</b>
                </div>
                <div>
                {item.winnerName}
                </div>
                <div>
                <b>Number of Laps</b>
                </div>
                <div>
                {item.numberOfLaps}
                </div>
                <div>
                <b>Grand Pix</b>
                </div>
                <div>
                {item.grandPrix}
                </div>
                <div>
                <b>Winner Time</b>
                </div>
                <div>
                {item.winnerTime}
                </div>
                </div>
        
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateRace(item.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRace(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Races;
