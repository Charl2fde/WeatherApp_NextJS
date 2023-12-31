// CardMap.tsx

interface CardMapProps {
    handleSearch: () => void;
    city: string;
    // Autres propriétés du composant, si nécessaire
}

const CardMap: React.FC<CardMapProps> = ({ handleSearch, city }) => {
    // Utilisez 'city' dans la construction de l'URL
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDzBAAaI8Og5jCA3-fwmpsYAYNHVXtI-PU&q=${encodeURIComponent(city)}`;

    return (
        <div>
            <iframe
                width="auto"
                height="auto"
                frameBorder="0"
                style={{ border: 0 }}
                src={mapUrl}
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default CardMap;
