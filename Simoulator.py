import random
import pandas as pd
from datetime import datetime, timedelta

# Parametreler
fields = ['Alan 1', 'Alan 2', 'Alan 3']
plants = {
    'Alan 1': 'Domates',
    'Alan 2': 'Biber',
    'Alan 3': 'Nane'
}
start_date = datetime(2024, 1, 1, 0, 0)
end_date = datetime(2024, 12, 31, 23, 59)
time_step_env = timedelta(hours=6)
time_step_growth = timedelta(days=1)

# İzmir'e göre sezonluk parametreler
seasonal_data = {
    'Kış': {'light': (2000, 4000), 'temp': (5, 15), 'humidity': (60, 80), 'wind': (2, 5)},
    'İlkbahar': {'light': (4000, 6000), 'temp': (12, 22), 'humidity': (50, 70), 'wind': (1.5, 4)},
    'Yaz': {'light': (6000, 9000), 'temp': (30, 40), 'humidity': (40, 60), 'wind': (2, 6)},
    'Sonbahar': {'light': (3000, 5000), 'temp': (20, 30), 'humidity': (50, 70), 'wind': (2, 5)},
}

# Bitki büyüme parametreleri
growth_data = {
    'Domates': {'growth': (1, 3), 'leaves': (3, 5)},
    'Biber': {'growth': (0.8, 2.5), 'leaves': (2, 4)},
    'Nane': {'growth': (0.5, 1.5), 'leaves': (1, 2)},
}

# Mevsimi belirleme fonksiyonu
def get_season(date):
    month = date.month
    if month in [12, 1, 2]:
        return 'Kış'
    elif month in [3, 4, 5]:
        return 'İlkbahar'
    elif month in [6, 7, 8]:
        return 'Yaz'
    elif month in [9, 10, 11]:
        return 'Sonbahar'

# Veri oluşturma
env_data = []
growth_data_list = []

current_time_env = start_date
current_time_growth = start_date

while current_time_env <= end_date:
    season = get_season(current_time_env)
    for field in fields:
        # Çevresel veriler
        light = random.uniform(*seasonal_data[season]['light'])
        temp = random.uniform(*seasonal_data[season]['temp'])
        humidity = random.uniform(*seasonal_data[season]['humidity'])
        wind = random.uniform(*seasonal_data[season]['wind'])
        water = random.uniform(3, 8)  # Alan geneli su seviyesi

        env_data.append({
            'Field': field,
            'DateTime': current_time_env,
            'LightIntensity': round(light, 2),
            'Temperature': round(temp, 2),
            'Humidity': round(humidity, 2),
            'WindSpeed': round(wind, 2),
            'WaterLevel': round(water, 2)
        })
    current_time_env += time_step_env

while current_time_growth <= end_date:
    for field in fields:
        plant = plants[field]
        height_growth = random.uniform(*growth_data[plant]['growth'])
        new_leaves = random.randint(*growth_data[plant]['leaves'])

        growth_data_list.append({
            'Field': field,
            'Date': current_time_growth.date(),
            'PlantType': plant,
            'HeightGrowth': round(height_growth, 2),
            'NewLeaves': new_leaves
        })
    current_time_growth += time_step_growth

# DataFrame ve CSV kayıtları
env_df = pd.DataFrame(env_data)
growth_df = pd.DataFrame(growth_data_list)

env_df.to_csv('environmental_data.csv', index=False)
growth_df.to_csv('growth_data.csv', index=False)
