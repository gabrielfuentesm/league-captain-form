
import TeamRegistrationForm from "../components/TeamRegistrationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Team Registration
          </h1>
          <p className="text-lg text-gray-600">
            Register your team for the upcoming league season
          </p>
        </div>
        <TeamRegistrationForm />
      </div>
    </div>
  );
};

export default Index;
