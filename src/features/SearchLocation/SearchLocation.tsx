import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { fetchGeoData, GeoData } from '@/shared/api/geo';
import { VscLoading } from 'react-icons/vsc';
import { MdMyLocation } from 'react-icons/md';
import { useWeatherStore, selectorWeatherFecths } from '@/shared/hooks/weather';
import { useShallow } from 'zustand/react/shallow';
import { selectorFetchAddress, useGeoStore } from '@/shared/hooks/geo';

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
  const { fetchAddress } = useGeoStore(useShallow(selectorFetchAddress));

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
      fetchAddress(coords).then((address) => {
        if (!address?.display_name) return;

        fetchDescriptionWeather(
          {
            coords,
            locationAdress: address.display_name,
          },
          false,
        );
      }),
      fetchCurrentWeather(coords, false),
      fetchDailyWeather(coords, false),
    ]);
  };

  const findMyLocation = async () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            async (geo) => {
              await Promise.all([
                fetchAddress(geo.coords).then((address) => {
                  if (!address?.display_name) return;

                  fetchDescriptionWeather(
                    {
                      coords: geo.coords,
                      locationAdress: address.display_name,
                    },
                    false,
                  );
                }),
                fetchCurrentWeather(geo.coords, false),
                fetchDailyWeather(geo.coords, false),
              ]);
            },
            (error) => {
              console.error(error);
            },
          );
        }
      });
    }
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
      <button type="submit" className="search-btn" aria-label="Search" onClick={findMyLocation} disabled={isLoading}>
        {isLoading ? <VscLoading className="h-8 w-8 flex-shrink-0 animate-spin" /> : <MdMyLocation />}
      </button>
    </div>
  );
};

export default SearchLocation;
