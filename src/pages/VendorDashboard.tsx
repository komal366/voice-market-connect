import { useState, useEffect } from "react";
import { Mic, MicOff, ShoppingCart, Package, Clock, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  item: string;
  quantity: string;
  priceLimit: string;
  status: 'pending' | 'matched' | 'confirmed' | 'delivered';
  supplier?: string;
  matchedPrice?: string;
  timestamp: Date;
}

export default function VendorDashboard() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedOrder, setParsedOrder] = useState<Partial<Order> | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      item: 'Tomatoes',
      quantity: '5 kg',
      priceLimit: '₹10/kg',
      status: 'delivered',
      supplier: 'Nashik Fresh Supplier',
      matchedPrice: '₹9.5/kg',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      item: 'Onions',
      quantity: '3 kg',
      priceLimit: '₹15/kg',
      status: 'confirmed',
      supplier: 'Mumbai Wholesale',
      matchedPrice: '₹14/kg',
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);
  const { toast } = useToast();

  const mockSuppliers = [
    { name: "Nashik Fresh Supplier", stock: "6 kg", price: "₹9.5/kg", rating: 4.8 },
    { name: "Mumbai Wholesale", stock: "10 kg", price: "₹11/kg", rating: 4.5 },
    { name: "Local Farm Direct", stock: "4 kg", price: "₹8.5/kg", rating: 4.9 }
  ];

  const startListening = () => {
    setIsListening(true);
    setTranscript("");
    
    // Mock voice recognition
    const mockTranscripts = [
      "I need 5 kg tomatoes under 10 rupees per kg",
      "Order 3 kg onions maximum 15 rupees per kg",
      "Get me 2 kg potatoes below 8 rupees per kg"
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    
    // Simulate real-time transcription
    let currentText = "";
    const words = randomTranscript.split(" ");
    
    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += (index > 0 ? " " : "") + word;
        setTranscript(currentText);
        
        if (index === words.length - 1) {
          setTimeout(() => {
            setIsListening(false);
            parseOrder(currentText);
          }, 500);
        }
      }, index * 300);
    });
  };

  const parseOrder = (text: string) => {
    // Mock NLP parsing
    const item = text.match(/(tomatoes|onions|potatoes|carrots|cabbage)/i)?.[1] || "Unknown item";
    const quantity = text.match(/(\d+)\s*(kg|kilogram)/i)?.[0] || "1 kg";
    const priceMatch = text.match(/(\d+)\s*rupees?/i);
    const priceLimit = priceMatch ? `₹${priceMatch[1]}/kg` : "₹10/kg";
    
    const parsed = {
      item: item.charAt(0).toUpperCase() + item.slice(1),
      quantity,
      priceLimit
    };
    
    setParsedOrder(parsed);
    toast({
      title: "Order Parsed Successfully!",
      description: `${parsed.quantity} ${parsed.item} under ${parsed.priceLimit}`,
    });
  };

  const confirmOrder = () => {
    if (!parsedOrder) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      item: parsedOrder.item!,
      quantity: parsedOrder.quantity!,
      priceLimit: parsedOrder.priceLimit!,
      status: 'pending',
      timestamp: new Date()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setParsedOrder(null);
    setTranscript("");
    
    // Mock supplier matching after 2 seconds
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === newOrder.id 
          ? { ...order, status: 'matched' as const, supplier: mockSuppliers[0].name, matchedPrice: mockSuppliers[0].price }
          : order
      ));
      
      toast({
        title: "Supplier Found!",
        description: `${mockSuppliers[0].name} can supply at ${mockSuppliers[0].price}`,
      });
    }, 2000);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Vendor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Voice-enabled ordering</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">John Vendor</span>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Voice Ordering Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Order Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice Input */}
                <div className="text-center">
                  <Button
                    size="lg"
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? () => setIsListening(false) : startListening}
                    className="h-20 w-20 rounded-full"
                  >
                    {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isListening ? "Listening... Speak your order" : "Tap to start voice order"}
                  </p>
                </div>

                {/* Live Transcription */}
                {transcript && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Live Transcription:</label>
                    <Textarea
                      value={transcript}
                      readOnly
                      className="min-h-[60px] bg-muted"
                      placeholder="Your spoken order will appear here..."
                    />
                  </div>
                )}

                {/* Parsed Order Preview */}
                {parsedOrder && (
                  <Card className="bg-accent border-accent-foreground/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Parsed Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Item:</span>
                          <p className="text-accent-foreground">{parsedOrder.item}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p className="text-accent-foreground">{parsedOrder.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium">Price Limit:</span>
                          <p className="text-accent-foreground">{parsedOrder.priceLimit}</p>
                        </div>
                      </div>
                      <Button onClick={confirmOrder} className="w-full">
                        Confirm & Find Suppliers
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Supplier Matches */}
                {parsedOrder && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Available Suppliers:</h3>
                    <div className="space-y-2">
                      {mockSuppliers.map((supplier, index) => (
                        <Card key={index} className="p-4 hover:shadow-card transition-shadow">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{supplier.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Stock: {supplier.stock} • Price: {supplier.price} • Rating: ⭐ {supplier.rating}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Select
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{order.item}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Quantity: {order.quantity}</p>
                        <p>Budget: {order.priceLimit}</p>
                        {order.supplier && (
                          <>
                            <p>Supplier: {order.supplier}</p>
                            <p>Final Price: {order.matchedPrice}</p>
                          </>
                        )}
                        <p>{order.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Orders:</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">This Month:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Savings:</span>
                  <span className="font-medium text-primary">₹2.5/kg</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}