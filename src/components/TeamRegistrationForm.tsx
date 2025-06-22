
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Users, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: string;
  phoneNumber: string;
  email: string;
}

const TeamRegistrationForm = () => {
  const [selectedLeague, setSelectedLeague] = useState('');
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fixed total cost per team
  const TOTAL_TEAM_COST = 500; // $500 per team

  // Calculate cost per player
  const costPerPlayer = numberOfPlayers > 0 ? TOTAL_TEAM_COST / numberOfPlayers : 0;

  // Generate player fields based on number of players
  useEffect(() => {
    const newPlayers: Player[] = Array.from({ length: numberOfPlayers }, (_, index) => ({
      id: `player-${index + 1}`,
      phoneNumber: players[index]?.phoneNumber || '',
      email: players[index]?.email || '',
    }));
    setPlayers(newPlayers);
  }, [numberOfPlayers]);

  const updatePlayer = (index: number, field: 'phoneNumber' | 'email', value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
  };

  const validateForm = (): boolean => {
    if (!selectedLeague) {
      toast({
        title: "League Required",
        description: "Please select a league to participate in.",
        variant: "destructive",
      });
      return false;
    }

    if (numberOfPlayers === 0) {
      toast({
        title: "Players Required",
        description: "Please specify the number of players.",
        variant: "destructive",
      });
      return false;
    }

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player.phoneNumber || !player.email) {
        toast({
          title: "Player Information Required",
          description: `Please fill in all information for Player ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(player.email)) {
        toast({
          title: "Invalid Email",
          description: `Please enter a valid email for Player ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }

      // Basic phone validation
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(player.phoneNumber)) {
        toast({
          title: "Invalid Phone Number",
          description: `Please enter a valid phone number for Player ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Prepare data for payment API
      const registrationData = {
        league: selectedLeague,
        numberOfPlayers,
        players,
        totalCost: TOTAL_TEAM_COST,
        costPerPlayer: Math.round(costPerPlayer * 100) / 100, // Round to 2 decimal places
      };

      console.log('Registration data:', registrationData);

      // Simulate payment API endpoint
      const paymentEndpoint = `/api/payment?amount=${costPerPlayer}&league=${encodeURIComponent(selectedLeague)}&players=${numberOfPlayers}`;
      
      toast({
        title: "Registration Successful!",
        description: `Redirecting to payment for $${costPerPlayer.toFixed(2)} per player...`,
      });

      // Simulate redirect to payment endpoint
      setTimeout(() => {
        window.location.href = paymentEndpoint;
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Team Registration Form
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* League Selection */}
          <div className="space-y-2">
            <Label htmlFor="league" className="text-lg font-semibold text-gray-700">
              In which league are you going to participate? *
            </Label>
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="Select a league" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="league-a">League A - Premier Division</SelectItem>
                <SelectItem value="league-b">League B - Championship Division</SelectItem>
                <SelectItem value="league-c">League C - Amateur Division</SelectItem>
                <SelectItem value="league-d">League D - Youth Division</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Players */}
          <div className="space-y-2">
            <Label htmlFor="numberOfPlayers" className="text-lg font-semibold text-gray-700">
              Select the number of players (excluding fringe players) *
            </Label>
            <Input
              type="number"
              id="numberOfPlayers"
              min="1"
              max="20"
              value={numberOfPlayers || ''}
              onChange={(e) => setNumberOfPlayers(parseInt(e.target.value) || 0)}
              className="w-full h-12 text-lg"
              placeholder="Enter number of players"
            />
          </div>

          {/* Cost Calculation Display */}
          {numberOfPlayers > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Cost Breakdown</h3>
                  <p className="text-gray-600">Total team cost: ${TOTAL_TEAM_COST}</p>
                  <p className="text-gray-600">Number of players: {numberOfPlayers}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    ${costPerPlayer.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">per player</p>
                </div>
              </div>
            </div>
          )}

          {/* Player Information Fields */}
          {players.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Player Information
              </h3>
              <div className="grid gap-6">
                {players.map((player, index) => (
                  <Card key={player.id} className="border-l-4 border-l-blue-500 bg-gray-50">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        Player {index + 1}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`phone-${index}`} className="font-medium text-gray-700">
                            Phone Number *
                          </Label>
                          <Input
                            type="tel"
                            id={`phone-${index}`}
                            value={player.phoneNumber}
                            onChange={(e) => updatePlayer(index, 'phoneNumber', e.target.value)}
                            className="h-11"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`email-${index}`} className="font-medium text-gray-700">
                            Email Address *
                          </Label>
                          <Input
                            type="email"
                            id={`email-${index}`}
                            value={player.email}
                            onChange={(e) => updatePlayer(index, 'email', e.target.value)}
                            className="h-11"
                            placeholder="player@example.com"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || numberOfPlayers === 0}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Registration...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Complete Registration & Pay ${costPerPlayer.toFixed(2)}
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamRegistrationForm;
