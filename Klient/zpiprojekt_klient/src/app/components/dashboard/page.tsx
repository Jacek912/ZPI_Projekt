// dashboard.tsx

function Dashboard() {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">Witam serdecznie, Kliencie mój!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Cieszymy się, że jesteś z nami. Oto Twoje personalizowane powitanie!
          </p>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  