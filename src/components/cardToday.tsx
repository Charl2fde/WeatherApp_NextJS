import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

const API_KEY = '6b1d5ecb1b816eb86b1b035afb017936';

const getWeatherIcon = (weatherType) => {
  const iconSize = useBreakpointValue({ base: '2em', md: '3em', lg: '4em' });
  switch (weatherType) {
  case 'Clear':
      return <WiDaySunny size={iconSize} />;
  case 'Clouds':
      return <WiCloudy size={iconSize} />;
  case 'Rain':
      return <WiRain size={iconSize} />;
  case 'Snow':
      return <WiSnow size={iconSize} />;
  default:
      return <Box />;
  }
  };

const CurrentWeatherCard = ({ city }) => {
const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        } else {
          console.error('Erreur lors de la récupération des données météorologiques');
        }
      } catch (error) {
        console.error('Erreur réseau :', error);
      }
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  if (!weatherData) {
    return null;
  }

  const cardWidth = useBreakpointValue({ base: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 8px)', lg: 'calc(25% - 8px)' });
  const fontSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });
  return (
    <Box  width={cardWidth} mb={6}>
      <Card boxShadow="none" bg="white" border="none" borderRadius="20px">
        <CardBody textAlign="center">
          <Box display="flex" alignItems="center" justifyContent="center" height="60px">
            {getWeatherIcon(weatherData.weather[0].main)}
          </Box>
          <Heading size="sm">{new Date(weatherData.dt * 1000).toLocaleDateString()}</Heading>
          <Text>{weatherData.weather[0].description}</Text>
          <Text color="blue.600" fontSize="lg">{weatherData.main.temp}°C</Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CurrentWeatherCard;