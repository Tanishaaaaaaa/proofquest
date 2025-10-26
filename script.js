// Function to calculate matured amount
function calculateMaturedAmount(type, investedAmount, interestRate, investmentDate, maturityDate) {
    if (type === 'PPF') return null;
    
    const timeInYears = (new Date(maturityDate) - new Date(investmentDate)) / (1000 * 60 * 60 * 24 * 365);
    const n = 1; // Compounding yearly
    const r = interestRate / 100; // Convert percentage to decimal
    return investedAmount * Math.pow(1 + r/n, n * timeInYears);
}

// Function to format currency
function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

// Function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Function to create table row
function createTableRow(investment) {
    return `
        <tr>
            <td>${investment.type}</td>
            <td>${investment.investment}</td>
            <td>${investment.accountNumber}</td>
            <td>${investment.name}</td>
            <td>${formatDate(investment.investmentDate)}</td>
            <td>${formatDate(investment.maturityDate)}</td>
            <td>${formatCurrency(investment.investedAmount)}</td>
            <td>${investment.interestRate}%</td>
            <td>${investment.maturedAmount ? formatCurrency(investment.maturedAmount) : 'Not applicable for PPF'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="openEditModal(${investment.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteInvestment(${investment.id})">Delete</button>
                </div>
            </td>
        </tr>
    `;
}

// Function to load and display investments
async function loadInvestments() {
    try {
        const response = await fetch('http://localhost:3004/api/investments');
        const investments = await response.json();
        const tableBody = document.getElementById('investmentsTableBody');
        tableBody.innerHTML = investments.map(investment => createTableRow(investment)).join('');
    } catch (error) {
        console.error('Error loading investments:', error);
        alert('Error loading investments. Please try again.');
    }
}

// Function to search investments
async function searchInvestments() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    console.log('Search term:', searchTerm);
    
    if (!searchTerm) {
        loadInvestments();
        return;
    }

    try {
        console.log('Sending search request to:', `http://localhost:3004/api/investments/search/${encodeURIComponent(searchTerm)}`);
        const response = await fetch(`http://localhost:3004/api/investments/search/${encodeURIComponent(searchTerm)}`);
        console.log('Search response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const investments = await response.json();
        console.log('Received investments:', investments);
        
        const tableBody = document.getElementById('investmentsTableBody');
        
        if (investments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 20px;">
                        No investments found for "${searchTerm}"
                    </td>
                </tr>
            `;
            return;
        }

        // Group investments by person's name
        const groupedInvestments = investments.reduce((acc, investment) => {
            if (!acc[investment.name]) {
                acc[investment.name] = [];
            }
            acc[investment.name].push(investment);
            return acc;
        }, {});

        // Create table rows with person's name as a header
        let html = '';
        for (const [name, personInvestments] of Object.entries(groupedInvestments)) {
            // Add person's name as a header row
            html += `
                <tr class="person-header">
                    <td colspan="10" style="background-color: #f0f7ff; font-weight: bold; padding: 15px;">
                        ${name}'s Investments
                    </td>
                </tr>
            `;
            
            // Add all investments for this person
            html += personInvestments.map(investment => createTableRow(investment)).join('');
        }
        
        tableBody.innerHTML = html;
    } catch (error) {
        console.error('Error details:', error);
        alert('Error searching investments. Please try again.');
    }
}

// Remove the input event listener and add keypress event listener for Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        searchInvestments();
    }
});

// Function to open edit modal
async function openEditModal(id) {
    try {
        const response = await fetch(`http://localhost:3004/api/investments/${id}`);
        const investment = await response.json();
        
        document.getElementById('editId').value = investment.id;
        document.getElementById('editType').value = investment.type;
        document.getElementById('editInvestment').value = investment.investment;
        document.getElementById('editAccountNumber').value = investment.accountNumber;
        document.getElementById('editName').value = investment.name;
        document.getElementById('editInvestmentDate').value = investment.investmentDate;
        document.getElementById('editMaturityDate').value = investment.maturityDate;
        document.getElementById('editInvestedAmount').value = investment.investedAmount;
        document.getElementById('editInterestRate').value = investment.interestRate;
        
        document.getElementById('editModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading investment details:', error);
        alert('Error loading investment details. Please try again.');
    }
}

// Function to close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Function to delete investment
async function deleteInvestment(id) {
    if (!confirm('Are you sure you want to delete this investment?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3004/api/investments/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        alert('Investment deleted successfully');
        loadInvestments();
    } catch (error) {
        console.error('Error deleting investment:', error);
        alert('Error deleting investment. Please try again.');
    }
}

// Handle form submission for new investment
document.getElementById('investmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const investmentData = {
        type: document.getElementById('type').value,
        investment: document.getElementById('investment').value,
        accountNumber: document.getElementById('accountNumber').value,
        name: document.getElementById('name').value,
        investmentDate: document.getElementById('investmentDate').value,
        maturityDate: document.getElementById('maturityDate').value,
        investedAmount: parseFloat(document.getElementById('investedAmount').value),
        interestRate: parseFloat(document.getElementById('interestRate').value)
    };

    investmentData.maturedAmount = calculateMaturedAmount(
        investmentData.type,
        investmentData.investedAmount,
        investmentData.interestRate,
        investmentData.investmentDate,
        investmentData.maturityDate
    );

    try {
        const response = await fetch('http://localhost:3004/api/investments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(investmentData)
        });
        
        const result = await response.json();
        
        // Create a new row with the calculated matured amount
        const newRow = createTableRow({
            ...investmentData,
            id: result.id
        });
        
        // Add the new row to the table
        const tableBody = document.getElementById('investmentsTableBody');
        tableBody.insertAdjacentHTML('afterbegin', newRow);
        
        alert('Investment saved successfully!');
        this.reset();
    } catch (error) {
        console.error('Error saving investment:', error);
        alert('Error saving investment. Please try again.');
    }
});

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const investmentData = {
        type: document.getElementById('editType').value,
        investment: document.getElementById('editInvestment').value,
        accountNumber: document.getElementById('editAccountNumber').value,
        name: document.getElementById('editName').value,
        investmentDate: document.getElementById('editInvestmentDate').value,
        maturityDate: document.getElementById('editMaturityDate').value,
        investedAmount: parseFloat(document.getElementById('editInvestedAmount').value),
        interestRate: parseFloat(document.getElementById('editInterestRate').value)
    };

    investmentData.maturedAmount = calculateMaturedAmount(
        investmentData.type,
        investmentData.investedAmount,
        investmentData.interestRate,
        investmentData.investmentDate,
        investmentData.maturityDate
    );

    try {
        const response = await fetch(`http://localhost:3004/api/investments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(investmentData)
        });
        
        const result = await response.json();
        alert('Investment updated successfully!');
        closeEditModal();
        loadInvestments();
    } catch (error) {
        console.error('Error updating investment:', error);
        alert('Error updating investment. Please try again.');
    }
});

// Load investments when page loads
window.addEventListener('load', loadInvestments); 