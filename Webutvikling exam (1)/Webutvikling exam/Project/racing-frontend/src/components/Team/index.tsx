import React, { useState, useEffect } from 'react';

interface TeamStateType {
  id: number | null;
  manufacturer: string;
  image: string;
  driver1: string;
  driver2: string;
}
interface DriverStateType {
  id: number | null;
  age: number | null;
  image: string;
  name: string;
  nationality: string;
}

const Team: React.FC = () => {
  const initialTeamState: TeamStateType = {
    id: null,
    manufacturer: '',
    image: '',
    driver1: '',
    driver2: '',
  };

  const [team, setTeam] = useState<TeamStateType>(initialTeamState);
  const [teams, setTeams] = useState<TeamStateType[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [drivers, setDrivers] = useState<DriverStateType[]>([]);

  const fetchDrivers = async (): Promise<void> => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/Driver/Get`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setDrivers(data.result);
      } else {
        console.error('Error fetching drivers:', data);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const fetchTeams = async (): Promise<void> => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/team/get`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setTeams(data.result);
      } else {
        console.error('Error fetching teams:', data);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchTeams();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setTeam({ ...team, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeam({ ...team, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUpdateTeam = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!team.manufacturer || !team.image || !team.driver1 || !team.driver2) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    //@ts-ignore
    formData.append('ID', team.id);
    formData.append('manufacturer', team.manufacturer);
    formData.append('driver1', team.driver1);
    formData.append('driver2', team.driver2);

    // Convert the base64 data URL to a Blob
    const imageBlob = await fetch(team.image).then((res) => res.blob());

    // Append the image with a filename (you may adjust the filename as needed)
    formData.append('image', imageBlob, 'team-image.png');

    const apiUrl = isUpdating
      ? `${process.env.REACT_APP_BACKEND_URL}/api/team/Update`
      : `${process.env.REACT_APP_BACKEND_URL}/api/team/Add`;

    const requestOptions: RequestInit = {
      method: isUpdating ? 'PUT' : 'POST',
      body: formData,
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      console.log('data: ', data);

      if (response.ok) {
        if (isUpdating) {
          setTeams(teams.map((item) => (item.id === team.id ? team : item)));
          setIsUpdating(false);
        } else {
          setTeams([...teams, { ...team, id: Date.now() }]);
        }

        setTeam(initialTeamState);
      } else {
        alert('Error: Unable to add/update team');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Error: Unable to add/update team');
    }
  };

  const handleDeleteTeam = async (id: number | null): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this Team?')) {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/team/Delete/${id}`;
      const requestOptions: RequestInit = {
        method: 'DELETE',
      };

      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setTeams(teams.filter((item) => item.id !== id));
      } else {
        console.error('Error deleting team:', data);
        alert('Error: Unable to delete team');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Error: Unable to delete team');
    }   
    }
  };

  const handleUpdateTeam = (id: number | null): void => {
    const selectedTeam = teams.find((item) => item.id === id);
    setTeam(selectedTeam || initialTeamState);
    setIsUpdating(true);
  };

  console.log('drivers', drivers);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h2 className="text-white">Add/Update Team</h2>
          <form onSubmit={handleAddUpdateTeam}>
            <div className="mb-3">
              <label htmlFor="manufacturer" className="form-label text-white">
                Manufacturer
              </label>
              <input
                type="text"
                className="form-control"
                id="manufacturer"
                name="manufacturer"
                value={team.manufacturer}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label text-white">
                Car Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="image"
                name="image"
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="driver1" className="form-label text-white">
                Driver 1
              </label>
              <select
                className="form-control"
                id="driver1"
                name="driver1"
                value={team.driver1}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Driver 1
                </option>
                {drivers.map((driver) => (
                  <option key={driver?.id} value={driver?.id || ''}>
                    {driver?.id} - {driver?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="driver2" className="form-label text-white">
                Driver 2
              </label>
              <select
                className="form-control"
                id="driver2"
                name="driver2"
                value={team.driver2}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Driver 2
                </option>
                {drivers.map((driver) => (
                  <option key={driver?.id} value={driver?.id || ''}>
                    {driver?.id} - {driver?.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {isUpdating ? 'Update Team' : 'Add Team'}
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <h2 className="text-white">Team List</h2>
        <div className="list-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <ul className="list-group">
            {teams.map((item) => (
              <li
                key={item.id || undefined}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.manufacturer}
                <div>
                  <img
                    src={item.image}
                    alt="team"
                    className="img-fluid"
                    style={{ width: '300px', height: '200px' }}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateTeam(item.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTeam(item.id)}
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

export default Team;
