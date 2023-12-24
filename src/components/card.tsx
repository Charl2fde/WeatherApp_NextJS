import { JSX, useState } from 'react';
import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  Spacer,
  SimpleGrid,
} from '@chakra-ui/react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';
import CurrentWeatherCard from './cardToday'; // Importer cardToday
import { Card, CardBody } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';



const API_KEY = '6b1d5ecb1b816eb86b1b035afb017936'; // Remplacez par votre clé API

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [additionalData, setAdditionalData] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        const next7DaysData = filterNext7DaysData(data.list);
        setWeatherData(next7DaysData);
        getAdditionalData();
      } else {
        setWeatherData(null);
        setAdditionalData(null);
        console.error('Erreur lors de la récupération des données météorologiques');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  const getWeatherIcon = (weather: any, iconProps: JSX.IntrinsicAttributes) => {
    switch (weather) {
      case 'Clear':
        return <WiDaySunny {...iconProps} />;
      case 'Clouds':
        return <WiCloudy {...iconProps} />;
      case 'Rain':
        return <WiRain {...iconProps} />;
      case 'Snow':
        return <WiSnow {...iconProps} />;
      default:
        return null;
    }
  };

  const getAdditionalData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        setAdditionalData(data);
      } else {
        setAdditionalData(null);
        console.error('Erreur lors de la récupération des données supplémentaires');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  const filterNext7DaysData = (list: any[]) => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1); // Date de demain pour exclure aujourd'hui
    const next7DaysData = list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt);
      return forecastDate >= tomorrow && forecastDate <= getFutureDate(currentDate, 7);
    });
    return next7DaysData.reduce((acc, forecast) => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = forecast;
      }
      return acc;
    }, {});
  };

  const getFutureDate = (date: string | number | Date, days: number) => {
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + days);
    return futureDate;
  };



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
          color='teal'
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
  <Flex flexWrap="wrap" mt={8} justifyContent="space-between">
    {Object.values(weatherData).map((forecast, index) => (
      <Box key={index} width={['100%', 'calc(20% - 8px)', 'calc(20% - 8px)', 'calc(20% - 8px)', 'calc(20% - 8px)']} mb={6}>
        <Card boxShadow="none" bg="white" border="none" borderRadius="20px">
          <CardBody textAlign="center">
            <Box display="flex" alignItems="center" justifyContent="center" height="60px">
              {getWeatherIcon(forecast.weather[0].main, { size: '4em' })}
            </Box>
            <Stack mt="4" spacing="2">
              <Heading size="sm">{new Date(forecast.dt_txt).toLocaleDateString()}</Heading>
              <Text>{forecast.weather[0].description}</Text>
              <Text color="blue.600" fontSize="lg">{forecast.main.temp}°C</Text>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    ))}
  </Flex>
)}

      {additionalData && (
  <SimpleGrid columns={[2, 3]} spacing="10px" mt="2" p="4">
    <Card colSpan={[2, 1]} borderRadius="12px" height="120px" margin="5px">
      <CardBody textAlign="center">
        <Heading size="lg">{additionalData?.name}</Heading>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="12px" height="120px" margin="5px">
      <CardBody textAlign="center">
        <Heading size="sm">Vitesse du vent</Heading>
        <Text color="blue.600" fontSize="lg">{additionalData?.wind.speed} km/h</Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="12px" height="120px" margin="5px">
      <CardBody textAlign="center">
        <Heading size="sm">Couché et Levé du soleil</Heading>
        <Text color="blue.600" fontSize="lg">Couché : {new Date(additionalData?.sys.sunset * 1000).toLocaleTimeString()}</Text>
        <Text color="blue.600" fontSize="lg">Levé : {new Date(additionalData?.sys.sunrise * 1000).toLocaleTimeString()}</Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="12px" height="120px" margin="5px">
      <CardBody textAlign="center">
        <Heading size="sm">Taux d'humidité</Heading>
        <Text color="blue.600" fontSize="lg">{additionalData?.main.humidity}%</Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="12px" height="120px" margin="5px">
      <CardBody textAlign="center">
        <Heading size="sm">Température Min/Max</Heading>
        <Text color="blue.600" fontSize="lg">
          Min : {additionalData?.main.temp_min}°C<br />
          Max : {additionalData?.main.temp_max}°C
        </Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="12px" height="120px" margin="5px">
      <CardBody textAlign="center">
        <Heading size="sm">Visibilité</Heading>
        <Text color="blue.600" fontSize="lg">{additionalData?.visibility / 1000} km</Text>
      </CardBody>
    </Card>
  </SimpleGrid>
)}


    </Box>
  );
}