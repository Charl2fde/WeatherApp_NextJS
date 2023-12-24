import { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  Text,
  Box,
  Spacer,
  Card,
  CardBody,
  Stack,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

const API_KEY = '6b1d5ecb1b816eb86b1b035afb017936';

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
        // Filtrer pour obtenir un enregistrement par jour
        const dailyData = filterDailyData(data.list);
        setWeatherData(dailyData);
        // Appeler la fonction pour obtenir les données supplémentaires
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

  // Fonction pour filtrer les données pour obtenir un enregistrement par jour
  const filterDailyData = (list) => {
    const dailyData = {};
    list.forEach((forecast) => {
      const date = forecast.dt_txt.split(' ')[0]; // Récupérer la date
      if (!dailyData[date]) {
        dailyData[date] = forecast;
      }
    });
    return Object.values(dailyData);
  };

  const getWeatherIcon = (weather, iconProps) => {
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
        <Flex direction="row" wrap="wrap" mt={8} p="4" overflowX="auto">
          {weatherData.slice(0, 7).map((forecast) => (
            <Box key={forecast.dt} mb={4} flex="1" minWidth="150px" mx={2}>
              <Card boxShadow="none" bg="white" border="none" borderRadius="20px">
                <CardBody>
                  <Box display="flex" alignItems="center" justifyContent="center" height="80px">
                    {getWeatherIcon(forecast.weather[0].main, { size: '6em' })}
                  </Box>

                  <Stack mt="6" spacing="3">
                    <Heading size="md">{forecast.dt_txt}</Heading>
                    <Text>{forecast.weather[0].description}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      {forecast.main.temp}°C
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            </Box>
          ))}
        </Flex>
      )}


{additionalData && (
  <SimpleGrid columns={[2, 3]} spacing="5px" mt="2px" p="4px">
    <Card colSpan={[2, 1]} borderRadius="20px" height="180px" margin="10px">
      <CardBody textAlign="center">
        <Heading size="2xl">{additionalData?.name}</Heading>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="20px" height="180px" margin="10px">
      <CardBody textAlign="center">
        <Heading size="md">Vitesse du vent</Heading>
        <Text color="blue.600" fontSize="2xl">{additionalData?.wind.speed} km/h</Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="20px" height="180px" margin="10px">
      <CardBody textAlign="center">
        <Heading size="md">Couché et Levé du soleil</Heading>
        <Text color="blue.600" fontSize="2xl">Couché : {new Date(additionalData?.sys.sunset * 1000).toLocaleTimeString()}</Text>
        <Text color="blue.600" fontSize="2xl">Levé : {new Date(additionalData?.sys.sunrise * 1000).toLocaleTimeString()}</Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="20px" height="180px" margin="10px">
      <CardBody textAlign="center">
        <Heading size="md">Taux d'humidité</Heading>
        <Text color="blue.600" fontSize="2xl">{additionalData?.main.humidity}%</Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="20px" height="180px" margin="10px">
      <CardBody textAlign="center">
        <Heading size="md">Température Min/Max</Heading>
        <Text color="blue.600" fontSize="2xl">
          Min : {additionalData?.main.temp_min}°C<br />
          Max : {additionalData?.main.temp_max}°C
        </Text>
      </CardBody>
    </Card>

    <Card colSpan={1} borderRadius="20px" height="180px" margin="10px">
      <CardBody textAlign="center">
        <Heading size="md">Visibilité</Heading>
        <Text color="blue.600" fontSize="2xl">{additionalData?.visibility / 1000} km</Text>
      </CardBody>
    </Card>
  </SimpleGrid>
)}


    </Box>
  );
}
