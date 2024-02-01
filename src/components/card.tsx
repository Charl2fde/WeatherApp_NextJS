import { useState, useEffect, JSX } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/react';
import CurrentWeatherCard from '../components/cardToday';

const API_KEY = ${{ process.env.API_KEY }};

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [additionalData, setAdditionalData] = useState(null);

  const handleSearch = async () => {
    try {
      const searchCity = city || 'Paris';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        const next5DaysData = filterNext5DaysData(data.list);
        setWeatherData(next5DaysData);
        getAdditionalData(searchCity);
      } else {
        setWeatherData(null);
        setAdditionalData(null);
        console.error('Error fetching weather data');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const filterNext5DaysData = (list: any[]) => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const next5DaysData = list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt);
      return (
        forecastDate >= tomorrow &&
        forecastDate <= getFutureDate(currentDate, 7)
      );
    });
    return next5DaysData.reduce((acc, forecast) => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = forecast;
      }
      return acc;
    }, {});
  };

  const getWeatherIcon = (weather: any, iconProps: any) => {
    switch (weather) {
      case 'Clear':
        return <WiDaySunny {...iconProps} style={{ color: 'yellow' }} />;
      case 'Clouds':
        return <WiCloudy {...iconProps} style={{ color: 'gray' }} />;
      case 'Rain':
        return <WiRain {...iconProps} style={{ color: 'blue' }} />;
      case 'Snow':
        return <WiSnow {...iconProps} style={{ color: 'white' }} />;
      default:
        return null;
    }
  };

  const getAdditionalData = async (searchCity: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        setAdditionalData(data);
      } else {
        setAdditionalData(null);
        console.error('Error fetching additional data');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };



  const getFutureDate = (date: string | number | Date, days: number) => {
    const futureDate = new Date(date);
    futureDate.setDate((date as Date).getDate() + days);
    return futureDate;
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        p="4"
        width="100%"
        color="blue.500"
      >
        <Flex align="center">
          <Text fontSize="xl" ml="2" color="blue.500">
            My Weather App
          </Text>
        </Flex>
        <Spacer />
        <Input
          placeholder='Entrez le nom de la ville'
          _placeholder={{ color: 'inherit' }}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          mr="2"
          w="300px"
        />
        <Button colorScheme="blue" onClick={handleSearch}>
          Rechercher
        </Button>
      </Flex>

      {weatherData && (
        <Box>
          <Heading size="lg" mb={4} textAlign="center">Prochains jours</Heading>
          <Flex flexWrap="wrap" mt={8} justifyContent="space-around">
            {Object.values(weatherData).map((forecast, index) => (
              <Box key={index} width={['100%', 'calc(20% - 8px)', 'calc(20% - 8px)', 'calc(20% - 8px)', 'calc(20% - 8px)']} mb={6}>
                <Card boxShadow="none" bg="white" border="none" borderRadius="20px">
                  <CardBody textAlign="center">
                    <Box display="flex" alignItems="center" justifyContent="center" height="60px">
                      {getWeatherIcon((forecast as any).weather[0].main, { size: '3em' })}
                    </Box>
                    <Stack mt="4" spacing="2">
                      <Heading size="sm">{(forecast as any).dt_txt && new Date((forecast as any).dt_txt).toLocaleDateString()}</Heading>
                      <Text>{(forecast as any).weather[0].description}</Text>
                      <Text color="blue.600" fontSize="lg">{(forecast as any).main.temp}°C</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      {additionalData && (
        <Box>
          <Heading size="lg" mb={4} textAlign="center">Informations supplémentaires</Heading>
          <SimpleGrid columns={[2, 3]} spacing="10px" mt="2" p="4">
            <Card borderRadius="12px" height="120px" margin="5px">
              <CardBody textAlign="center">
                <Heading size="lg">{(additionalData as any)?.name}</Heading>
              </CardBody>
            </Card>

            <Card borderRadius="12px" height="120px" margin="5px">
              <CardBody textAlign="center">
                <Heading size="sm">Vitesse du vent</Heading>
                <Text color="blue.600" fontSize="lg">
                  {(additionalData as any).main?.temp} km/h
                </Text>
              </CardBody>
            </Card>

            <Card borderRadius="12px" height="120px" margin="5px">
              <CardBody textAlign="center">
                <Heading size="sm">Couché et Levé du soleil</Heading>
                <Text color="blue.600" fontSize="lg">Couché : {new Date((additionalData as any).sys.sunset * 1000).toLocaleTimeString()}</Text>
                <Text color="blue.600" fontSize="lg">Levé : {new Date((additionalData as any).sys.sunrise * 1000).toLocaleTimeString()}</Text>
              </CardBody>
            </Card>

            <Card borderRadius="12px" height="120px" margin="5px">
              <CardBody textAlign="center">
                <Heading size="sm">Taux d'humidité</Heading>
                <Text color="blue.600" fontSize="lg">{(additionalData as any).main.humidity}%</Text>
              </CardBody>
            </Card>

            <Card borderRadius="12px" height="120px" margin="5px">
              <CardBody textAlign="center">
                <Heading size="sm">Température Min/Max</Heading>
                <Text color="blue.600" fontSize="lg">
                  Min : {(additionalData as any).main.temp_min}°C<br />
                  Max : {(additionalData as any).main.temp_max}°C
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardBody textAlign="center">
                {additionalData && (additionalData as any).coord && (
                  <iframe
                    title="City Map"
                    width="auto"
                    height="auto"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDzBAAaI8Og5jCA3-fwmpsYAYNHVXtI-PU&q=${(additionalData as any).coord.lat},${(additionalData as any).coord.lon}`}
                  ></iframe>
                )}
              </CardBody>
            </Card>


          </SimpleGrid>
        </Box>
      )}
      <Box mt={8}>
        <CurrentWeatherCard weatherData={weatherData} setCity={undefined} />
      </Box>
    </Box>

  );
}
