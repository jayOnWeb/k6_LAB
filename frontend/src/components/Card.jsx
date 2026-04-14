const Card = ({ title, value }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
};

export default Card;