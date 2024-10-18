"use client"

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../redux/store/transactionsSlice';
import { fetchStatistics } from '../redux/store/statisticsSlice';
import { fetchBarChartData } from '../redux/store/chartsSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from "date-fns";

import Button from "./Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import Input from "./input";
import { Select, SelectItem } from "./Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TransactionDashboard() {
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState("3");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const transactions = useSelector((state) => state.transactions.data);
  const statistics = useSelector((state) => state.statistics.data);
  const barChartData = useSelector((state) => state.charts.barChartData);
  const totalPages = useSelector((state) => state.transactions.totalPages);

  useEffect(() => {
    console.log("🚀 ~ TransactionDashboard ~ barChartData:", barChartData)
  }, [barChartData]);

  useEffect(() => {
    dispatch(fetchTransactions({ search: searchTerm, month: parseInt(selectedMonth), page: currentPage, perPage: 10 }));
    dispatch(fetchStatistics(parseInt(selectedMonth)));
    dispatch(fetchBarChartData(parseInt(selectedMonth)));
  }, [dispatch, selectedMonth, searchTerm, currentPage]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const chartData = {
    labels: barChartData?.priceBuckets?.map(bucket => `$${bucket._id}`) || [],
    datasets: [
      {
        label: 'Sold',
        data: barChartData?.priceBuckets?.map(bucket => bucket.totalSold) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Not Sold',
        data: barChartData?.priceBuckets?.map(bucket => bucket.totalNotSold) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price Range Distribution',
      },
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transaction Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Select value={selectedMonth} onChange={handleMonthChange} className="w-[180px]">
            <option value="" disabled>Select month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {format(new Date(2023, i, 1), "MMMM")}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search transactions"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sale Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statistics?.totalSaleAmount?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sold Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalSoldItems || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Not Sold Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalNotSoldItems || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>List of transactions for {format(new Date(2023, parseInt(selectedMonth) - 1, 1), "MMMM")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Date of Sale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.price.toLocaleString()}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.sold ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{format(new Date(transaction.dateOfSale), "dd MMM yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Range Distribution</CardTitle>
          <CardDescription>Number of items per price range for {format(new Date(2023, parseInt(selectedMonth) - 1, 1), "MMMM")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}