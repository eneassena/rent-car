import { useParams } from 'react-router-dom';

const VehiclesDetails = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <h3>Vehicles Details Page</h3>

        </div>
    );
};

export default VehiclesDetails;
