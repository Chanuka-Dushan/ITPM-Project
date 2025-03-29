import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MealPlanningHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-green-800">
            Meal Planning System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/create-meal-plan">
              <Button variant="outline" className="w-full">
                Create Meal Plan
              </Button>
            </Link>
            <Link to="/nutrition-tracker">
              <Button variant="outline" className="w-full">
                Nutrition Tracker
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/meal-history">
              <Button variant="outline" className="w-full">
                Meal History
              </Button>
            </Link>
            <Link to="/diet-goals">
              <Button variant="outline" className="w-full">
                Diet Goals
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/recipe-library">
              <Button variant="outline" className="w-full">
                Recipe Library
              </Button>
            </Link>
            <Link to="/shopping-list">
              <Button variant="outline" className="w-full">
                Shopping List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlanningHome;