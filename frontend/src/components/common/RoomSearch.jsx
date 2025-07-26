import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomService } from '../../services/roomService';

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        // For now, use static room types - will be replaced with API call later
        setRoomTypes(['Standard', 'Deluxe', 'Suite', 'VIP']);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  /**This methods is going to be used to show errors */
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  /**THis is going to be used to fetch avaailabe rooms from database base on seach data that'll be passed in */
  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError('Vui lòng chọn đầy đủ thông tin');
      return false;
    }
    try {
      // Convert startDate to the desired format
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
      
      // Call the API to fetch available rooms
      const response = await roomService.getAvailableRoomsByDateRange(formattedStartDate, formattedEndDate);

      // Check if the response is successful
      if (response.statusCode === 200) {
        if (response.phongList && response.phongList.length === 0) {
          showError('Không có phòng trống trong khoảng thời gian này.');
          return
        }
        handleSearchResult(response.phongList || []);
        setError('');
      }
    } catch (error) {
      showError("Có lỗi xảy ra: " + (error.message || 'Không thể tìm kiếm phòng'));
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhận phòng</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày nhận phòng"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày trả phòng</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày trả phòng"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại phòng</label>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="input">
            <option disabled value="">
              Chọn loại phòng
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full" onClick={handleInternalSearch}>
            Tìm phòng
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default RoomSearch;
