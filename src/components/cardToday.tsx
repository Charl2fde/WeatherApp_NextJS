import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

const getWeatherIcon = (weather) => {
  switch (weather) {
    case 'Clear':
      return <WiDaySunny size="9em" color="yellow" />;
    case 'Clouds':
      return <WiCloudy size="9em" color="gray" />;
    case 'Rain':
      return <WiRain size="9em" color="blue" />;
    case 'Snow':
      return <WiSnow size="9em" color="white" />;
    default:
      return null;
  }
};

const CurrentWeatherCard = ({ weatherData, setCity }) => {
  if (!weatherData || !weatherData.weather || !weatherData.main || !weatherData.name) {
    return null;
  }

  const { weather, main, name, dt } = weatherData;
  const date = new Date(dt * 1000);

  const handleSetCity = () => {
    setCity(name); 
  };

  return (
    <Box boxShadow="none" bg="white" border="none" borderRadius="20px" p="20px" textAlign="center">
      <Box mb="20px" display="flex" justifyContent="center">
        {getWeatherIcon(weather[0]?.main)}
      </Box>
      <Text mt="10px" fontSize="lg">{date.toLocaleDateString()}</Text>
      <Text mt="10px">{weather[0]?.description}</Text>
      <Text mt="10px">{main.temp}°C</Text>
      
    </Box>
  );
};

export default CurrentWeatherCard;
