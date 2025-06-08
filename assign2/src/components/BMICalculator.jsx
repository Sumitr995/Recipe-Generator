import React, { useState } from 'react';
import axios from 'axios';
import "./bmi.css"

const DietRecommendation = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dietPreference, setDietPreference] = useState('vegetarian'); // 'vegetarian' or 'non-vegetarian'
  const [calorieRange, setCalorieRange] = useState({});
  const [mealPlan, setMealPlan] = useState({ breakfast: null, lunch: null, dinner: null });
  const [error, setError] = useState('');

  const apiKey = 'fa723c6eb01948618fb63c9af0483425'; // Replace with your Spoonacular API key

  const calculateBMI = () => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const calculateBMR = () => {
    if (!weight || !height || !age) return null;
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };

  const getCalorieRange = (bmr) => {
    return {
      min: bmr - 100,
      max: bmr + 100,
    };
  };

  const fetchMealOptions = async (calories, diet) => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
        params: {
          targetCalories: calories,
          timeFrame: 'day',
          diet: dietPreference,
          apiKey,
        },
      });

      const meals = response.data.meals;

      const detailedMeals = await Promise.all(
        meals.map(async (meal) => {
          const mealDetails = await axios.get(
            `https://api.spoonacular.com/recipes/${meal.id}/information`,
            { params: { apiKey } }
          );
          return { ...meal, details: mealDetails.data };
        })
      );

      setMealPlan({
        breakfast: detailedMeals[0] || null,
        lunch: detailedMeals[1] || null,
        dinner: detailedMeals[2] || null,
      });
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to fetch meals. Please try again.');
    }
  };

  const generateDietPlan = () => {
    const bmiValue = calculateBMI();
    const bmrValue = calculateBMR();

    if (!bmiValue || !bmrValue) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setBmi(bmiValue);
    setBmr(bmrValue);
    setError('');

    const calorieTarget = getCalorieRange(bmrValue);
    setCalorieRange(calorieTarget);

    const averageCalories = Math.round((calorieTarget.min + calorieTarget.max) / 2);
    fetchMealOptions(averageCalories, dietPreference);
  };

  return (
    <div className="diet-recommendation">
      <h1>Diet Recommendation System</h1>

      <div className="input-section">
        <label>Weight (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <label>Height (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Diet Preference:</label>
        <select value={dietPreference} onChange={(e) => setDietPreference(e.target.value)}>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
        </select>

        <button onClick={generateDietPlan}>Generate Diet Plan</button>
      </div>

      {error && <p className="error">{error}</p>}

      {bmi && bmr && (
        <div className="results">
          <p><strong>BMI:</strong> {bmi}</p>
          <p><strong>BMR:</strong> {bmr} kcal/day</p>
        </div>
      )}

      {mealPlan.breakfast && (
        <div className="meal-plan">
          <h2>Meal Plan</h2>

          <div className="meal-section">
            <h3>Breakfast</h3>
            <div className="meal-card">
              <img src={mealPlan.breakfast.details.image} alt={mealPlan.breakfast.details.title} />
              <h4>{mealPlan.breakfast.details.title}</h4>
              <p><strong>Ingredients:</strong></p>
              <ul>
                {mealPlan.breakfast.details.extendedIngredients.map((ing) => (
                  <li key={ing.id}>{ing.original}</li>
                ))}
              </ul>
              <p><strong>Instructions:</strong> {mealPlan.breakfast.details.instructions || 'No instructions provided.'}</p>
            </div>
          </div>

          <div className="meal-section">
            <h3>Lunch</h3>
            <div className="meal-card">
              <img src={mealPlan.lunch.details.image} alt={mealPlan.lunch.details.title} />
              <h4>{mealPlan.lunch.details.title}</h4>
              <p><strong>Ingredients:</strong></p>
              <ul>
                {mealPlan.lunch.details.extendedIngredients.map((ing) => (
                  <li key={ing.id}>{ing.original}</li>
                ))}
              </ul>
              <p><strong>Instructions:</strong> {mealPlan.lunch.details.instructions || 'No instructions provided.'}</p>
            </div>
          </div>

          <div className="meal-section">
            <h3>Dinner</h3>
            <div className="meal-card">
              <img src={mealPlan.dinner.details.image} alt={mealPlan.dinner.details.title} />
              <h4>{mealPlan.dinner.details.title}</h4>
              <p><strong>Ingredients:</strong></p>
              <ul>
                {mealPlan.dinner.details.extendedIngredients.map((ing) => (
                  <li key={ing.id}>{ing.original}</li>
                ))}
              </ul>
              <p><strong>Instructions:</strong> {mealPlan.dinner.details.instructions || 'No instructions provided.'}</p>
            </div>
          </div>

          <button onClick={generateDietPlan}>Change Meals</button>
        </div>
      )}
    </div>
  );
};

export default DietRecommendation;
