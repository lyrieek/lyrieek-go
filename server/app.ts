import * as express from 'express'
import * as expressWs from 'express-ws'

const { app, getWss } = expressWs(express())
// const app = express();
app.listen(1234)
// expressWs(app)

console.log("http://localhost:1234/");

const userList = []
const chressData = []

app.use(express.static('../dist'))

app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/', function (req: any, res: any) {
	res.redirect('/index.html')
})

app.get('/clear', function (req: any, res: any) {
	chressData.length = 0
})

app.post('/chressData', function (req: any, res: any) {
	res.send(JSON.stringify(chressData))
})

const _wss = getWss('/')
app.ws('/', function (ws: any, req: any) {
	ws.on('message', function (msg: any) {
		const data = JSON.parse(msg);
		if (data.clear) {
			chressData.length = 0
			_wss.clients.forEach((client) => client.send(JSON.stringify({
				clear: true
			})));
			return
		}
		chressData.push(data)
		_wss.clients.forEach((client) => {
			client.send(JSON.stringify(data))
		});
	})
})
