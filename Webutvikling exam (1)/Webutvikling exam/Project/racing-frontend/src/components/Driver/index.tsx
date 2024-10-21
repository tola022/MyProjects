import React, { useState, useEffect } from 'react';

interface DriverStateType {
  id: number | null;
  name: string;
  age: number;
  nationality: string;
  image: string;
}

const Driver: React.FC = () => {
  const initialDriverState: DriverStateType = { id: null, name: '', age: 0, nationality: '', image: '' };

  const [driver, setDriver] = useState<DriverStateType>(initialDriverState);
  const [drivers, setDrivers] = useState<DriverStateType[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchString, setSearchString] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setDriver({ ...driver, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDriver({ ...driver, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUpdateDriver = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!driver.name || !driver.age || !driver.nationality || !driver.image) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
  
    formData.append('ID', driver.id as unknown as string);
    formData.append('name', driver.name);
    formData.append('age', String(driver.age));
    formData.append('nationality', driver.nationality);

    const imageBlob = await fetch(driver.image).then((res) => res.blob());
    const extension = driver.image.split(';')[0].split('/')[1];
    formData.append('image', imageBlob, `driver-image.${extension}`);

    const apiUrl = isUpdating
      ? `${process.env.REACT_APP_BACKEND_URL}/api/Driver/Update`
      : `${process.env.REACT_APP_BACKEND_URL}/api/Driver/Add`;

    const requestOptions: RequestInit = {
      method: isUpdating ? 'PUT' : 'POST',
      body: formData,
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
       await response.json();

      if (response.ok) {
        fetchDrivers();
        setDriver(initialDriverState);
        setIsUpdating(false);
        const successMessage = isUpdating
          ? 'Driver Updated successfully! '
          : 'New Driver Added successfully! ';
        alert(successMessage);
      } else {
        alert('Error: Unable to add/update driver');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Error: Unable to add/update driver');
    }
  };

  const handleDeleteDriver = async (id: number | null): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/Driver/Delete/${id}`;

      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await fetch(apiUrl, requestOptions);

        if (response.ok) {
          fetchDrivers();
          alert('Driver deleted successfully!');
        } else {
          alert('Error: Unable to delete driver');
        }
      } catch (error) {
        console.error('API error:', error);
        alert('Error: Unable to delete driver');
      }
    }
  };

  const handleUpdateDriver = (id: number | null): void => {
    const selectedDriver = drivers.find((item) => item.id === id);
    setDriver(selectedDriver || initialDriverState);
    setIsUpdating(true);
  };

  const fetchDrivers = async (): Promise<void> => {
    try {
      const apiUrl = searchString
        ? `${process.env.REACT_APP_BACKEND_URL}/api/Driver/Get/?search=${searchString}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/Driver/Get`;

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

  useEffect(() => {
    fetchDrivers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h2 className='text-white'>Add/Update Driver</h2>
          <form onSubmit={handleAddUpdateDriver}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-white">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={driver.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="age" className="form-label text-white">
                Age
              </label>
              <input
                type="number"
                className="form-control"
                min={0}
                id="age"
                name="age"
                value={driver.age}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nationality" className="form-label text-white">
                Nationality
              </label>
              <input
                type="text"
                className="form-control"
                id="nationality"
                name="nationality"
                value={driver.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label text-white">
                Image Upload
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
            <button type="submit" className="btn btn-primary">
              {isUpdating ? 'Update Driver' : 'Add Driver'}
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <h2 className='text-white'>Driver List</h2>
          <div className="mb-3">
            <label htmlFor="search" className="form-label text-white">
              Search
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="search"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            
            </div>
          </div>
          <div className="list-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <ul className="list-group">
              {drivers.map((item) => (
                <li
                  key={item.id || undefined}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.name}
                  <div>
                    <img
                      src={item.image}
                      alt="driver"
                      className="img-fluid"
                      style={{ width: '300px', height: '200px' }}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdateDriver(item.id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteDriver(item.id)}
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

export default Driver;
