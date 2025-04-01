import React from 'react'
import { useLoaderData } from 'react-router-dom'

export default function RecipeList() {
  const allRecipes= useLoaderData()
  console.log(allRecipes)
  return (
    <div>
     <RecipeList />
    </div>
    )
  }