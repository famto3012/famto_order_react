import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@mui/material";

export default function SummaryPage() {
  const location = useLocation();
  const savedData = location.state?.savedData || {}; // Retrieve passed data

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-6">📦 Package Summary</h2>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(savedData).map(([index, data]) => (
          <Card key={index} sx={{ borderRadius: "20px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" }} className="p-4">
            <CardContent className="text-center">
              <img src={categories[index].image} alt={categories[index].name} className="h-24 mx-auto rounded-lg" />
              <p className="mt-2 font-semibold">{categories[index].name}</p>
              <p className="text-sm text-gray-600">📏 Dimensions: {data.length} x {data.breadth} cm</p>
              <p className="text-sm text-gray-600">⚖️ Weight: {data.weight} kg</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
