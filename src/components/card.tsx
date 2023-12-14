// pages/index.js

import { useState } from 'react';
import {
    Flex, 
    Input, 
    Button, 
    Text,
    Box,
    Spacer,
    Image,
    Card,
    CardBody,
    Stack,
    Heading,
    Divider,
  } from '@chakra-ui/react';
  import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';
  
const API_KEY = '6b1d5ecb1b816eb86b1b035afb017936';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

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
      } else {
        setWeatherData(null);
        console.error('Erreur lors de la récupération des données météorologiques');
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

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear':
        return <WiDaySunny />;
      case 'Clouds':
        return <WiCloudy />;
      case 'Rain':
        return <WiRain />;
      case 'Snow':
        return <WiSnow />;
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
        bg="white"
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
        <Flex direction="row" wrap="wrap" mt={8} p="4">
          {weatherData.slice(0, 7).map((forecast) => (
            <Box key={forecast.dt} mb={4} flex="1" minWidth="250px" mx={2}>
              <Card>
                <CardBody>
                  {getWeatherIcon(forecast.weather[0].main)} {/* Utilisation de l'icône météo */}
                  <Stack mt="6" spacing="3">
                    <Heading size="md">{forecast.dt_txt}</Heading>
                    <Text>{forecast.weather[0].description}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      {forecast.main.temp}°C
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
              </Card>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}
