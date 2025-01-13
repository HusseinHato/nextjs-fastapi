import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  
  const products = [
    {
      id: "#12594",
      name: "Shark",
      category: "Animal",
      weight: "0.3 kg",
      contributor: "Aya",
    },
    {
      id: "#12490",
      name: "Car",
      category: "Vehicle",
      weight: "0.5 kg",
      contributor: "Ame",
    },
    {
      id: "#12306",
      name: "Truck",
      category: "Vehicle",
      weight: "1 kg",
      contributor: "Zahra",
    },
  ]
  
  export function ProductTable() {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle>Product Details</CardTitle>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Contributor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.weight}</TableCell>
                  <TableCell>{product.contributor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
  
  