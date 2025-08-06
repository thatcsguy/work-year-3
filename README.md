# Anniversary Game - Distance Challenge Visualization

A beautiful web-based visualization for your anniversary game where players try to position themselves as far as possible from all other players on a 50x50 coordinate grid.

## 🎯 How the Game Works

1. Players fill out a Google Form with X and Y coordinates (0-50)
2. The goal is to be the player farthest from all other players
3. Distance is calculated using the standard Euclidean distance formula
4. The visualization shows all players and highlights the top 3 winners

## 🚀 Getting Started

### Option 1: Open Directly in Browser
1. Simply open `index.html` in any modern web browser
2. No server setup required!

### Option 2: Local Server (Recommended for CSV uploads)
If you encounter issues with CSV file uploads due to browser security restrictions:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Using PHP (if installed)
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📊 Features

- **Interactive Scatter Plot**: Visualizes all player positions on a 50x50 grid
- **Top 3 Winners**: Clearly highlighted with gold, silver, and bronze styling
- **Detailed Statistics**: Shows total players, average distances, and more
- **Sortable Player Table**: View all players ranked by their average distance
- **CSV Upload Support**: Upload your Google Forms CSV export
- **Sample Data**: Built-in sample data to test the visualization
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern, professional design perfect for sharing

## 📁 CSV Format

Your CSV file should have the following columns:
```csv
Name,X,Y
Alice,45,47
Bob,5,8
Charlie,25,25
```

**Required Columns:**
- `Name` (or `name`): Player's name
- `X` (or `x`): X coordinate (0-50)
- `Y` (or `y`): Y coordinate (0-50)

## 🎮 How to Use

1. **Load Data**:
   - Click "Load Sample Data" to see the visualization with example data
   - Or upload your own CSV file using the file upload button

2. **View Results**:
   - Top 3 winners are displayed prominently at the top
   - Interactive map shows all player positions
   - Detailed table shows all players sorted by performance

3. **Share Results**:
   - The visualization is fully self-contained
   - You can share the HTML file or host it online
   - Perfect for presenting results to your team

## 🏆 Scoring System

The game uses the **nearest neighbor distance** scoring method:

1. For each player, find the distance to their closest neighbor
2. The player with the greatest distance to their nearest neighbor wins!
3. This rewards the most isolated players - those who positioned themselves farthest from everyone else

This method identifies true isolation rather than just average positioning, making for more strategic gameplay.

## 🛠️ Technical Details

- **Built with**: Pure HTML, CSS, and JavaScript
- **Libraries Used**:
  - Chart.js for the scatter plot visualization
  - PapaParse for CSV file parsing
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **No Dependencies**: Everything runs client-side

## 📝 Customization

The visualization is easy to customize:

- **Colors**: Edit the CSS color schemes in `styles.css`
- **Grid Size**: Change the coordinate limits in `game.js`
- **Scoring**: Modify the distance calculation algorithm
- **Layout**: Adjust the responsive grid layout

## 🎨 Features Highlights

- **Real-time Calculations**: Instant distance calculations and ranking
- **Visual Hierarchy**: Clear winner highlighting with medal colors
- **Interactive Elements**: Hover effects and detailed tooltips
- **Professional Design**: Clean, modern interface suitable for workplace sharing
- **Mobile Friendly**: Responsive design works on all devices

## 📈 Sample Results

The included sample data demonstrates various strategic positioning approaches:
- Corner strategies (Maya at 1,1 and Noah at 49,49)
- Edge positioning (Eve at 48,3 and Diana at 2,48)
- Center avoidance strategies

Perfect for analyzing different player approaches and sparking discussions about optimal strategies!

---

**Enjoy your anniversary game! 🎉**
