from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

#database
def get_db_connection():
    conn = sqlite3.connect('ets.db')
    return conn

def create_database():
    with get_db_connection() as conn:
        c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            expense_date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS income (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            source TEXT,
            income_date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category_name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS savings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            savings_date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    conn.commit()
    conn.close()
create_database()

#routes
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if not username or not password:
        return jsonify({'message': 'usename and password are required!'}), 400
    try:
        conn = create_database()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users ( username, password) VALUES (?, ?)', (username, password))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'message': 'Error registering user: ' + str(e)}), 500
    finally:
        conn.close()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data['username']
    password = data['password']

    conn = create_database()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({'message': 'Login successful', 'user_id': user['id']}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    user_id = data['user_id']
    amount = data['amount']
    category = data['category']
    expense_date = data['expense_date']

    conn = create_database()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO expenses (user_id, amount, description, date) VALUES (?, ?, ?, ?)', 
                   (user_id, amount, category, expense_date))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Expense added successfully'}), 201

@app.route('/expenses/<int:user_id>', methods=['GET'])
def get_expenses(user_id):
    conn = create_database()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()

    expenses_list = [dict(expense) for expense in expenses]
    return jsonify(expenses_list), 200

@app.route('/expenses/filter/<int:user_id>', methods=['GET'])
def filter_expenses(user_id):
    month = request.args.get('month')
    year = request.args.get('year')

    conn = create_database()
    expenses = conn.execute('''
        SELECT * FROM expenses 
        WHERE user_id = ? AND strftime('%m', expense_date) = ? AND strftime('%Y', expense_date) = ?
    ''', (user_id, month, year)).fetchall()
    conn.close()

    expenses_list = [dict(expense) for expense in expenses]
    return jsonify(expenses_list), 200

@app.route('/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    data = request.get_json()
    amount = data.get('amount')
    category = data.get('category')
    expense_date = data.get('expense_date')
    
    conn = create_database()
    cursor = conn.cursor()
    
    # Check if the expense exists
    cursor.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,))
    expense = cursor.fetchone()
    
    if expense:
        cursor.execute('''UPDATE expenses
                          SET amount = ?, category = ?, expense_date = ?
                          WHERE id = ?''', 
                       (amount, category, expense_date, expense_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Expense updated successfully'}), 200
    else:
        conn.close()
        return jsonify({'message': 'Expense not found'}), 404

@app.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    conn = create_database()
    cursor = conn.cursor()

    # Check if the expense exists
    cursor.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,))
    expense = cursor.fetchone()

    if expense:
        # Delete the expense
        cursor.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Expense deleted successfully'}), 200
    else:
        conn.close()
        return jsonify({'message': 'Expense not found'}), 404


@app.route('/income', methods=['POST'])
def add_income():
    income_data = request.get_json()
    
    # Extract data from the request
    amount = income_data.get('amount')
    source = income_data.get('source')
    income_date = income_data.get('income_date')

    if not amount or not income_date:
        return jsonify({'message': 'Amount and date are required'}), 400

    # Insert the income into the database
    conn = create_database()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO income (amount, source, date)
        VALUES (?, ?, ?)
    ''', (amount, source, income_date))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Income added successfully'}), 201


@app.route('/income', methods=['GET'])
def get_all_income():
    conn = create_database()
    cursor = conn.cursor()

    # Query to get all income records
    cursor.execute('SELECT * FROM income')
    income_records = cursor.fetchall()

    conn.close()

    # Convert records to a list of dictionaries
    income_list = []
    for record in income_records:
        income_list.append({
            'id': record[0],
            'amount': record[1],
            'source': record[2],
            'income_date': record[3]
        })

    return jsonify(income_list), 200


if __name__=='__main__':
    app.run()
    