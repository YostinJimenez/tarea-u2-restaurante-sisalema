const LoggerMiddleware = (req, res, next) => {
    // Aca nos dice que el tiempo en ejecucion es el timestamp de la peticion
    const timestamp = new Date().toISOString;
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP:${req.ip}`);
    // Aca nos dice que el tiempo en ejecucion es el tiempo que tarda en ejecutarse la peticion
    const start = Date.now();
    // const duration = Date.now() - start;
    // Aca nos dice que el tiempo en ejecucion es el tiempo que tarda en ejecutarse la peticion
    // console.log(`Tiempo de ejecución: ${duration} ms .Reponse ${res.statusCode}-${duration}`);
    // next();
    // Aca nos dice que el tiempo en ejecucion es el tiempo que tarda en ejecutarse la peticion
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] Response: ${res.statusCode} - ${duration}ms`);
    });
    next();
};


module.exports = LoggerMiddleware;