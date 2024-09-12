import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { fetchGeoData, GeoData } from '@/shared/api/geo';
import { VscLoading } from 'react-icons/vsc';
import { MdMyLocation } from 'react-icons/md';
import { useWeatherStore, selectorWeatherFecths } from '@/entities/weather';
import { useShallow } from 'zustand/react/shallow';
import { requestAndUpdateGeoAddress, updateGeoAddress } from '@/entities/geolocation';

const SearchLocation = () => {
  const [isActivateSearch, setisActivateSearch] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GeoData[]>([]);
  const searchBlockRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { fetchCurrentWeather, fetchDailyWeather, fetchDescriptionWeather } = useWeatherStore(
    useShallow(selectorWeatherFecths),
  );

  useEffect(() => {
    if (!isActivateSearch) return;
    if (!(debouncedSearchTerm.length >= 3)) return;

    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = (await fetchGeoData({ search: debouncedSearchTerm })) as GeoData[];
        setSearchResults(response);
        inputRef.current?.focus();
      } catch (error) {
        setSearchResults([]);
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchTerm, isActivateSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchBlockRef.current?.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActivateSearch) setisActivateSearch(true);
    setSearchTerm(event.target.value);
  };

  const handleClick = async (location: GeoData) => {
    setisActivateSearch(false);
    setSearchTerm('');
    setSearchResults([]);

    const coords = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    await Promise.all([
      updateGeoAddress(coords),
      fetchCurrentWeather(coords, false),
      fetchDailyWeather(coords, false),
      fetchDescriptionWeather(
        {
          coords,
          locationAdress: location.address.display_name,
        },
        false,
      ),
    ]);
  };

  return (
    <div ref={searchBlockRef} className="search-block">
      <div className="form-group">
        <input
          type="search"
          id="searchInput"
          name="search"
          autoComplete="off"
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleInputChange}
          ref={inputRef}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((location) => (
              <li key={location.latitude}>
                <button onClick={() => handleClick(location)}>{location.address.display_name}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="search-btn"
        aria-label="Search"
        onClick={requestAndUpdateGeoAddress}
        disabled={isLoading}
      >
        {isLoading ? <VscLoading className="h-8 w-8 flex-shrink-0 animate-spin" /> : <MdMyLocation />}
      </button>
    </div>
  );
};

export default SearchLocation;
