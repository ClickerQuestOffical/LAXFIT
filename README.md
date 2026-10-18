# LAXFIT - Find Your Game. Find Your Position.

An adaptive, interactive website that helps boys' lacrosse players discover their best position and build their perfect lacrosse stick.

## Features

- **Adaptive Quiz Engine**: Questions change based on your previous answers to provide personalized recommendations
- **Comprehensive Position Coverage**: Evaluates all boys' field lacrosse positions including specialized roles
- **Dual Mode Support**: Player Mode for self-assessment and Coach Mode for evaluating others
- **Beginner Friendly**: Designed for players of all experience levels, from newcomers to experienced athletes
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Static Website**: Built with HTML, CSS, and JavaScript - no backend required
- **LAXFIT Stick Lab**: Build your perfect lacrosse stick based on your position, playing style, budget, and preferences

## Positions Evaluated

### Attack
- X Attackman (offensive playmaker behind the goal)
- Wing Attackman (side-focused scorer)
- Crease Attackman (close-range finisher)

### Midfield
- Offensive Midfielder (attack-minded)
- Two-Way Midfielder (versatile both ends)
- Short-Stick Defensive Midfielder (SSDM)
- Long-Stick Midfielder (LSM)
- Faceoff Specialist (FOGO)

### Defense
- Close Defenseman

### Goalie
- Goalie

## How It Works

### Position Finder Quiz
1. **Select Mode**: Choose Player Mode (for self-assessment) or Coach Mode (for evaluating a player)
2. **Adaptive Quiz**: Answer questions that intelligently adapt based on your responses
3. **Get Results**: Receive a personalized position recommendation with strengths, development areas, and next steps
4. **Explore Alternatives**: See other positions that might be a good fit

### Stick Lab (New Feature)
1. **Import Position Results**: Use your position quiz results or select your position manually
2. **Select Budget**: Choose your budget range for a complete stick build
3. **Answer Adaptive Questions**: Answer questions about your shaft, head, mesh, and tape preferences
4. **Get Recommendations**: Receive a personalized stick build with specific product recommendations
5. **Review & Edit**: Review your build and make changes as needed
6. **Purchase Components**: Get links to purchase each component from verified retailers

## Adaptive Algorithm

The quiz uses an explainable, client-side adaptive algorithm that:

### Position Finder
- Maintains running compatibility scores for each position
- Selects questions based on expected information gain
- Focuses on resolving uncertainties between top candidate positions
- Stops when sufficient evidence is gathered or maximum questions reached
- Provides reasoned recommendations rather than simple point totals

### Stick Lab
- Uses position profile, budget, and adaptive question answers to recommend equipment
- Implements a weighted matching algorithm for shafts, heads, mesh, and tape
- Considers compatibility between components and budget constraints
- Provides explainable recommendations showing why each component was selected
- Allows users to edit selections and see real-time budget updates

## Technical Implementation

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: GitHub Pages compatible
- **No External Dependencies**: All logic runs in the browser
- **Privacy Focused**: No personal data collected or transmitted
- **Product Data**: Curated catalog of real lacrosse products with verified information

## Positions Evaluated

### Attack
- X Attackman (offensive playmaker behind the goal)
- Wing Attackman (side-focused scorer)
- Crease Attackman (close-range finisher)

### Midfield
- Offensive Midfielder (attack-minded)
- Two-Way Midfielder (versatile both ends)
- Short-Stick Defensive Midfielder (SSDM)
- Long-Stick Midfielder (LSM)
- Faceoff Specialist (FOGO)

### Defense
- Close Defenseman

### Goalie
- Goalie

## How It Works

1. **Select Mode**: Choose Player Mode (for self-assessment) or Coach Mode (for evaluating a player)
2. **Adaptive Quiz**: Answer questions that intelligently adapt based on your responses
3. **Get Results**: Receive a personalized position recommendation with strengths, development areas, and next steps
4. **Explore Alternatives**: See other positions that might be a good fit

## Adaptive Algorithm

The quiz uses an explainable, client-side adaptive algorithm that:

- Maintains running compatibility scores for each position
- Selects questions based on expected information gain
- Focuses on resolving uncertainties between top candidate positions
- Stops when sufficient evidence is gathered or maximum questions reached
- Provides reasoned recommendations rather than simple point totals

## Technical Implementation

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: GitHub Pages compatible
- **No External Dependencies**: All logic runs in the browser
- **Privacy Focused**: No personal data collected or transmitted

## Local Development

To run locally:
1. Clone or download this repository
2. Open `index.html` in a web browser
3. No build process or dependencies required

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to Repository Settings > Pages
3. Select the `main` branch and `/root` folder
4. Click Save - your site will be published

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - Application logic and adaptive quiz engine
- `README.md` - This file

## Customization

To modify the quiz:
1. Edit `script.js` to adjust question bank, position profiles, or weights
2. Update `styles.css` for design changes
3. Modify `index.html` for structural changes

## Browser Support

Works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

## Credits

Created as an adaptive lacrosse position finder to help players discover their ideal role on the field.