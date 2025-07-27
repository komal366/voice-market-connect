import { useState } from "react";
import { ShoppingCart, Package, Mic, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleSelectionCard } from "@/components/RoleSelectionCard";
import { AuthForm } from "@/components/AuthForm";

type UserType = 'vendor' | 'supplier' | null;

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserType>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleRoleSelect = (role: UserType) => {
    setSelectedRole(role);
    setShowAuth(true);
  };

  const handleBack = () => {
    setShowAuth(false);
    setSelectedRole(null);
  };

  if (showAuth && selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
        <AuthForm userType={selectedRole} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Mic className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">VoiceMarket</h1>
                <p className="text-sm text-muted-foreground">Voice-enabled marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Connecting vendors & suppliers</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Choose Your Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our voice-enabled marketplace where street vendors can easily order raw materials 
              and suppliers can efficiently manage their inventory.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <RoleSelectionCard
              title="I'm a Vendor"
              description="Street seller who wants to order raw materials using voice commands. Get matched with suppliers instantly."
              icon={ShoppingCart}
              selected={selectedRole === 'vendor'}
              onClick={() => setSelectedRole('vendor')}
            />
            
            <RoleSelectionCard
              title="I'm a Supplier"
              description="Wholesaler or supplier ready to fulfill orders. Manage inventory and connect with vendors in your area."
              icon={Package}
              selected={selectedRole === 'supplier'}
              onClick={() => setSelectedRole('supplier')}
            />
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => selectedRole && handleRoleSelect(selectedRole)}
              disabled={!selectedRole}
              className="px-8 py-3 text-lg"
            >
              Continue as {selectedRole ? (selectedRole === 'vendor' ? 'Vendor' : 'Supplier') : 'User'}
            </Button>
          </div>

          {/* Features Preview */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-3 text-accent-foreground">🎙️ For Vendors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Voice-to-text ordering in local language</li>
                <li>• Instant supplier matching</li>
                <li>• Real-time delivery tracking</li>
                <li>• Order history and analytics</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-3 text-accent-foreground">📦 For Suppliers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Easy inventory management</li>
                <li>• Order notifications and bidding</li>
                <li>• Delivery coordination tools</li>
                <li>• Sales analytics dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
