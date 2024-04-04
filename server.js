const path = require('path');
const express = require('express');
const routes = require('./server/controllers');
const sequelize = require('./server/config/connection');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
// const { authenticateToken } = require('./server/utils/auth');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
// app.use(authenticateToken);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './client/dist')));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

cron.schedule('0 8 * * *', async () => {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3003/api/'
    const response = await axios.get(apiUrl + 'autoEmail');
    updateCusts = response.data.data;
    console.log(updateCusts)
    updateCusts.forEach(custId => {
      axios.put(apiUrl + `customer/autoUpdate/${custId}`, { key: process.env.KEY })
        .then(() => console.log(`Updated customer ${custId} successfully`))
        .catch(error => console.error(`Error updating customer ${custId}:`, error));
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT} !`));
});
