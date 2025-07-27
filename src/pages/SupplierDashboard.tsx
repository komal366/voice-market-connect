import { useState } from "react";
import { Package, Plus, Bell, TrendingUp, User, LogOut, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  expiryDate: Date;
  location: string;
}

interface IncomingOrder {
  id: string;
  vendorName: string;
  item: string;
  quantity: string;
  maxPrice: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function SupplierDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Tomatoes',
      quantity: 50,
      price: 9.5,
      unit: 'kg',
      expiryDate: new Date(Date.now() + 172800000), // 2 days
      location: 'Warehouse A'
    },
    {
      id: '2',
      name: 'Onions',
      quantity: 30,
      price: 14,
      unit: 'kg',
      expiryDate: new Date(Date.now() + 432000000), // 5 days
      location: 'Warehouse B'
    },
    {
      id: '3',
      name: 'Potatoes',
      quantity: 75,
      price: 7,
      unit: 'kg',
      expiryDate: new Date(Date.now() + 604800000), // 7 days
      location: 'Warehouse A'
    }
  ]);

  const [orders, setOrders] = useState<IncomingOrder[]>([
    {
      id: '1',
      vendorName: 'Ramesh Street Vendor',
      item: 'Tomatoes',
      quantity: '5 kg',
      maxPrice: '₹10/kg',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      status: 'pending'
    },
    {
      id: '2',
      vendorName: 'Sunita Fruit Seller',
      item: 'Onions',
      quantity: '3 kg',
      maxPrice: '₹15/kg',
      timestamp: new Date(Date.now() - 600000), // 10 min ago
      status: 'pending'
    }
  ]);

  const [isAddingStock, setIsAddingStock] = useState(false);
  const { toast } = useToast();

  const handleAddStock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      unit: formData.get('unit') as string || 'kg',
      expiryDate: new Date(formData.get('expiry') as string),
      location: formData.get('location') as string
    };

    setInventory(prev => [...prev, newItem]);
    setIsAddingStock(false);
    toast({
      title: "Stock Added Successfully!",
      description: `${newItem.quantity} ${newItem.unit} of ${newItem.name} added to inventory`,
    });
  };

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: action === 'accept' ? 'accepted' : 'rejected' } : order
    ));

    const order = orders.find(o => o.id === orderId);
    toast({
      title: action === 'accept' ? "Order Accepted!" : "Order Rejected",
      description: action === 'accept' 
        ? `Order from ${order?.vendorName} has been accepted`
        : `Order from ${order?.vendorName} has been rejected`,
    });
  };

  const getStatusColor = (status: IncomingOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  const getExpiryColor = (expiryDate: Date) => {
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 2) return 'text-red-600';
    if (daysUntilExpiry <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Supplier Dashboard</h1>
                <p className="text-sm text-muted-foreground">Inventory & Order Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Mumbai Wholesale</span>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inventory Management */}
            <Card className="shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Current Inventory
                </CardTitle>
                <Dialog open={isAddingStock} onOpenChange={setIsAddingStock}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Stock</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddStock} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Item Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input id="quantity" name="quantity" type="number" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price per unit (₹)</Label>
                          <Input id="price" name="price" type="number" step="0.1" required />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Input id="unit" name="unit" placeholder="kg" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" name="expiry" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" placeholder="Warehouse A" required />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Add Stock</Button>
                        <Button type="button" variant="outline" onClick={() => setIsAddingStock(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {inventory.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Stock: {item.quantity} {item.unit}</span>
                            <span>Price: ₹{item.price}/{item.unit}</span>
                            <span>Location: {item.location}</span>
                            <span className={getExpiryColor(item.expiryDate)}>
                              Expires: {item.expiryDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="destructive">Remove</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Incoming Orders */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Incoming Orders ({orders.filter(o => o.status === 'pending').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4 border-l-4 border-l-primary">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{order.vendorName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="font-medium">Item:</span>
                          <p>{order.item}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p>{order.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium">Max Price:</span>
                          <p>{order.maxPrice}</p>
                        </div>
                      </div>

                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleOrderAction(order.id, 'accept')}
                            className="flex-1"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept Order
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleOrderAction(order.id, 'reject')}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Items:</span>
                  <span className="font-medium">{inventory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending Orders:</span>
                  <span className="font-medium text-yellow-600">
                    {orders.filter(o => o.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Accepted Today:</span>
                  <span className="font-medium text-green-600">
                    {orders.filter(o => o.status === 'accepted').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue This Month:</span>
                  <span className="font-medium text-primary">₹45,240</span>
                </div>
              </CardContent>
            </Card>

            {/* Expiry Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-red-600">⚠️ Expiry Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventory
                    .filter(item => {
                      const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry <= 5;
                    })
                    .map(item => {
                      const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-medium text-red-800">{item.name}</p>
                          <p className="text-sm text-red-600">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-red-500">{item.quantity} {item.unit} remaining</p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Order accepted from Ramesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Added 50kg Tomatoes to inventory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>New order request received</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Tomatoes expiring in 2 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}