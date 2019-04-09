let Service = require('node-windows').Service;
 
let svc = new Service({
    name: 'node_sjbw',    //服务名称
    description: '世纪博文项目', //描述
    wait: '5',
    grow: '0.5',
    maxRestarts: '20',
    script: 'D:/projects/sjbw_edu/bin/www' //nodejs项目要启动的文件路径
});
 
svc.on('installed', () => {
    svc.start();
    console.log('install');
});

svc.on('unistalled', () => {
    console.log('unistalled');
});

svc.on('alreadyinstalled', () => {
    console.log('alreadyinstalled');
});
 
if(svc.exists) return svc.uninstall();

svc.install();