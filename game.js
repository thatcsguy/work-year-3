// Game logic and visualization
class DistanceGame {
    constructor() {
        this.players = [];
        this.chart = null;
        // Inline sample data as CSV string (easy to copy-paste from spreadsheet)
        this.sampleDataCSV = `Name,X,Y
Amumu,45,47
Bard,5,8
Chogath,25,25
Diana,2,48
Ezreal,48,3
Fizz,15,35
Gangplank,38,12`;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Automatically load the inline sample data on page load
        this.loadInlineData();
    }

    // Load data from inline CSV string
    loadInlineData() {
        console.log('Loading inline CSV data...');
        Papa.parse(this.sampleDataCSV, {
            header: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.error('Error parsing inline CSV:', results.errors[0].message);
                    return;
                }
                console.log('Inline CSV parsed successfully:', results.data);
                this.processPlayers(results.data);
                this.updateVisualization();
            },
            error: (error) => {
                console.error('Error parsing inline CSV:', error.message);
            }
        });
    }

    // Calculate Euclidean distance between two points
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Calculate distance to nearest neighbor (most isolated wins)
    calculateNearestNeighborDistance(playerIndex) {
        const player = this.players[playerIndex];
        let minDistance = Infinity;

        for (let i = 0; i < this.players.length; i++) {
            if (i !== playerIndex) {
                const otherPlayer = this.players[i];
                const distance = this.calculateDistance(
                    player.x, player.y,
                    otherPlayer.x, otherPlayer.y
                );
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }

        return minDistance === Infinity ? 0 : minDistance;
    }

    // Find the nearest player to the winner
    findNearestPlayerToWinner() {
        if (this.players.length < 2) return null;
        
        const winner = this.players[0];
        let minDistance = Infinity;
        let nearestPlayer = null;
        
        for (let i = 1; i < this.players.length; i++) {
            const distance = this.calculateDistance(
                winner.x, winner.y,
                this.players[i].x, this.players[i].y
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestPlayer = this.players[i];
            }
        }
        
        return { player: nearestPlayer, distance: minDistance };
    }

    // Process player data and calculate scores
    processPlayers(data) {
        this.players = data.map((row, index) => ({
            name: row.Name || row.name || `Player ${index + 1}`,
            x: parseFloat(row.X || row.x || 0),
            y: parseFloat(row.Y || row.y || 0)
        })).filter(player => 
            !isNaN(player.x) && !isNaN(player.y) && 
            player.x >= 0 && player.x <= 50 && 
            player.y >= 0 && player.y <= 50
        );

        // Calculate nearest neighbor distances
        this.players.forEach((player, index) => {
            player.nearestDistance = this.calculateNearestNeighborDistance(index);
            player.rank = 0; // Will be set after sorting
        });

        // Sort by nearest neighbor distance (descending - farther from nearest neighbor is better)
        this.players.sort((a, b) => b.nearestDistance - a.nearestDistance);

        // Assign ranks
        this.players.forEach((player, index) => {
            player.rank = index + 1;
        });
    }

    // Update all visualization components
    updateVisualization() {
        this.updateChart();
        this.updateTable();
    }

    // Find the nearest player to the winner
    findNearestPlayerToWinner() {
        if (this.players.length < 2) return null;
        
        const winner = this.players[0];
        // Use the already calculated nearest distance from the winner
        const winnerNearestDistance = winner.nearestDistance;
        
        // Find which player is at that exact distance
        for (let i = 1; i < this.players.length; i++) {
            const distance = this.calculateDistance(
                winner.x, winner.y,
                this.players[i].x, this.players[i].y
            );
            if (Math.abs(distance - winnerNearestDistance) < 0.0001) { // Account for floating point precision
                return { player: this.players[i], distance: winnerNearestDistance };
            }
        }
        
        return null;
    }

    // Create or update the scatter plot chart
    updateChart() {
        const ctx = document.getElementById('gameChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        // Prepare data for chart - all players except winner in same color
        const datasets = [{
            label: 'Players',
            data: this.players.slice(1).map(player => ({
                x: player.x,
                y: player.y,
                label: player.name,
                nearestDistance: player.nearestDistance
            })),
            backgroundColor: 'rgba(129, 140, 248, 0.8)',
            borderColor: 'rgba(129, 140, 248, 1)',
            borderWidth: 2,
            pointRadius: 10,
            pointHoverRadius: 12
        }];

        // Add winner as separate dataset
        if (this.players.length > 0) {
            const winner = this.players[0];
            datasets.push({
                label: `Winner: ${winner.name}`,
                data: [{
                    x: winner.x,
                    y: winner.y,
                    label: winner.name,
                    nearestDistance: winner.nearestDistance
                }],
                backgroundColor: 'rgba(255, 215, 0, 0.9)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 3,
                pointRadius: 15,
                pointHoverRadius: 18
            });
        }

        // Store reference to players and nearest player function for the plugin
        const players = this.players;
        const findNearestPlayerToWinner = this.findNearestPlayerToWinner.bind(this);
        let hoveredPlayerIndex = null;

        this.chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1, // Make it square
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return [
                                    `${point.label}`,
                                    `Position: (${point.x}, ${point.y})`,
                                    `Distance to nearest: ${point.nearestDistance.toFixed(2)}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        min: 0,
                        max: 50,
                        ticks: {
                            stepSize: 5,
                            color: '#a0aec0'
                        },
                        grid: {
                            display: true,
                            color: 'rgba(160, 174, 192, 0.2)'
                        }
                    },
                    y: {
                        min: 0,
                        max: 50,
                        ticks: {
                            stepSize: 5,
                            color: '#a0aec0'
                        },
                        grid: {
                            display: true,
                            color: 'rgba(160, 174, 192, 0.2)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'point'
                },
                onHover: (event, activeElements) => {
                    event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                    
                    // Track which player is being hovered
                    if (activeElements.length > 0) {
                        const element = activeElements[0];
                        const datasetIndex = element.datasetIndex;
                        const pointIndex = element.index;
                        
                        if (datasetIndex === 0) {
                            // Hovering over regular players (first dataset)
                            hoveredPlayerIndex = pointIndex + 1; // +1 because players array includes winner at index 0
                        } else if (datasetIndex === 1) {
                            // Hovering over winner (second dataset)
                            hoveredPlayerIndex = 0;
                        }
                    } else {
                        hoveredPlayerIndex = null;
                    }
                    
                    // Trigger a redraw to show/hide hover circles
                    this.chart.update('none');
                }
            },
            plugins: [{
                id: 'playerLabels',
                afterDatasetsDraw: (chart) => {
                    const ctx = chart.ctx;
                    
                    // Draw player names
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((point, index) => {
                            const data = dataset.data[index];
                            const position = point.getProps(['x', 'y'], true);
                            
                            ctx.save();
                            ctx.fillStyle = '#e2e8f0';
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            
                            // Draw name above the point
                            ctx.fillText(data.label, position.x, position.y - 20);
                            ctx.restore();
                        });
                    });
                    
                    // Function to draw a player's nearest neighbor circle
                    const drawPlayerCircle = (playerIndex, isWinner = false) => {
                        if (!players || playerIndex >= players.length) return;
                        
                        const player = players[playerIndex];
                        let playerMeta, playerPoint;
                        
                        if (isWinner) {
                            playerMeta = chart.getDatasetMeta(1); // Winner is in second dataset
                            if (!playerMeta || playerMeta.data.length === 0) return;
                            playerPoint = playerMeta.data[0];
                        } else {
                            playerMeta = chart.getDatasetMeta(0); // Regular players in first dataset
                            if (!playerMeta || playerMeta.data.length <= playerIndex - 1) return;
                            playerPoint = playerMeta.data[playerIndex - 1]; // -1 because winner is not in first dataset
                        }
                        
                        const position = playerPoint.getProps(['x', 'y'], true);
                        
                        // Find the nearest player to this player
                        let minDistance = Infinity;
                        let nearestPlayer = null;
                        
                        for (let i = 0; i < players.length; i++) {
                            if (i !== playerIndex) {
                                const distance = Math.sqrt(
                                    Math.pow(players[i].x - player.x, 2) + 
                                    Math.pow(players[i].y - player.y, 2)
                                );
                                if (distance < minDistance) {
                                    minDistance = distance;
                                    nearestPlayer = players[i];
                                }
                            }
                        }
                        
                        if (nearestPlayer) {
                            const xScale = chart.scales.x;
                            const yScale = chart.scales.y;
                            
                            // Get the pixel position of the nearest player
                            const nearestPlayerPixelX = xScale.getPixelForValue(nearestPlayer.x);
                            const nearestPlayerPixelY = yScale.getPixelForValue(nearestPlayer.y);
                            
                            // Calculate the radius as the distance between player and nearest player in pixels
                            const radiusInPixels = Math.sqrt(
                                Math.pow(nearestPlayerPixelX - position.x, 2) + 
                                Math.pow(nearestPlayerPixelY - position.y, 2)
                            );
                            
                            ctx.save();
                            if (isWinner) {
                                // Winner's circle - always visible, golden color
                                ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
                                ctx.lineWidth = 3;
                                ctx.setLineDash([5, 5]);
                            } else {
                                // Hovered player's circle - blue color, slightly transparent
                                ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([3, 3]);
                            }
                            
                            ctx.beginPath();
                            ctx.arc(position.x, position.y, radiusInPixels, 0, 2 * Math.PI);
                            ctx.stroke();
                            
                            // Draw distance label
                            if (isWinner) {
                                ctx.fillStyle = 'rgba(255, 215, 0, 1)';
                                ctx.font = 'bold 14px Arial';
                            } else {
                                ctx.fillStyle = 'rgba(129, 140, 248, 0.9)';
                                ctx.font = 'bold 12px Arial';
                            }
                            ctx.textAlign = 'center';
                            ctx.fillText(
                                `Distance to nearest: ${minDistance.toFixed(1)}`,
                                position.x,
                                position.y + radiusInPixels + (isWinner ? 20 : 15)
                            );
                            ctx.restore();
                        }
                    };
                    
                    // Always draw winner's circle (index 0)
                    if (players && players.length > 0) {
                        drawPlayerCircle(0, true);
                    }
                    
                    // Draw hovered player's circle (if not the winner)
                    if (hoveredPlayerIndex !== null && hoveredPlayerIndex !== 0) {
                        drawPlayerCircle(hoveredPlayerIndex, false);
                    }
                }
            }]
        });
    }

    // Update the players table
    updateTable() {
        const tbody = document.getElementById('playersTableBody');
        tbody.innerHTML = '';

        this.players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.rank}</td>
                <td>${player.name}</td>
                <td>${player.x}</td>
                <td>${player.y}</td>
                <td>${player.nearestDistance.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DistanceGame();
});
