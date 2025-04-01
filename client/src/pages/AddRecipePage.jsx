import RecipeForm from "../components/recipeForm";

const AddRecipePage = () => {
  return (
    <div>
      <h2>Add New Recipe</h2>
      <RecipeForm onRecipeAdded={() => window.location.reload()} />
    </div>
  );
};

export default AddRecipePage;
