function getCoords(elem) {
	/*Получаем координаты относительно окна браузера*/
	let coords = elem.getBoundingClientRect();
	/*Высчитываем значения координат относительно документа, вычисляя прокрутку документа*/
	return {
		top : coords.top + window.pageYOffset,
		left : coords.left + window.pageXOffset,
		leftX: coords.left,
		rigth : coords.left + window.pageXOffset + coords.width,
		bottom : coords.top + window.pageYOffset + coords.height,
		width : coords.width
	}
}

function moveRange (elem) {
	/*Находим нужный элемент по классу или id*/
	var coords = getCoords(elem);

	/*Определяем зону окрашывания*/
	var colorRange = elem.parentElement.children[1];
	var f;//устанавливаем флаг для определения мин или макс элемента
	var value; //значение фильтра

	/*Определяем второй ползунок и родителя*/
	var parent = {}
		parent.element = elem.parentElement;
		parent.coords = getCoords(parent.element);

	var block2 = {}
	if (elem.classList.contains('block-min')) {
		block2.element = elem.parentElement.children[2];
		block2.coords = getCoords(block2.element);
		f=0;
	} else {
		block2.element = elem.parentElement.children[0];
		block2.coords = getCoords(block2.element);
		f=1;
	}

	/*Делаем индикатор над ползунком*/
    var indicator = document.createElement('div');
    if (elem.children.length){
       	elem.innerHTML = '';//обнуляем предыдущее значение
    }
	elem.appendChild(indicator);

	document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);

    /*выключаем браузерное событие DaD*/
    elem.ondragstart = function(){
        return false;
    }

	function onMouseMove(e) {

		/*Определяем смещение влево*/
        e.preventDefault();//предотвратить запуск выделения элементов

        /*Определяем положение мыши в зависимости от устройства*/
        /*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
        /*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/
        if (e.touches === undefined) {
        	var pos = e.clientX;
        } else {
        	var pos = e.targetTouches[0].clientX;
        }

        /*Устанавливаем границы движения ползунка*/
        let newLeft = pos - parent.coords.leftX;
        let rigthEdge = parent.coords.width - (coords.width+1);

        if (newLeft<0) {
        	newLeft = 0;
        } else if (newLeft > rigthEdge) {
        	newLeft = rigthEdge;
        }
        if (f == 0 && pos > block2.coords.left-block2.coords.width) {
        	newLeft = block2.coords.left - block2.coords.width - 5 - parent.coords.leftX;
        }else if (f == 1 && pos < block2.coords.rigth + 5) {
        	newLeft = block2.coords.rigth + 5 - parent.coords.leftX;
        }
        /*устанавливаем отступ нашему элементу*/
    	elem.style.left = newLeft + 'px';

    	//     Определяем значение фильтра
    	let rangeMin = +document.querySelector('.filter number:first-child').innerHTML;
    	let rangeMax = +document.querySelector('.filter number:last-child').innerHTML;
        if(f==0){
          value =  (newLeft / (parent.coords.width / (rangeMax - rangeMin)) + rangeMin).toFixed(1);
        } else {
          value = (newLeft / (parent.coords.width / (rangeMax - rangeMin))+ 0.3 + rangeMin).toFixed(1);
        }

    	/*Выводим значение над ползунком*/
    	indicator.style.position = 'absolute';
    	indicator.style.fontSize = "14px";
    	indicator.style.left = - coords.width/2 + "px";
    	indicator.style.top = parseFloat(window.getComputedStyle(elem).getPropertyValue('top')) - 10 +"px";

    	/*Для красоты слайдера уберем вывод значений в начальной и конечной точках*/
    	if (newLeft <= 0){
    		indicator.innerHTML= "";
    	} else if (newLeft >= rigthEdge) {
    		indicator.innerHTML= "";
    	} else {
    		indicator.innerHTML = value;
    	}


    	/*Делаем цветную плашечку диапазона выбора*/
    	if (f == 0) {
	    	colorRange.style.left = newLeft + coords.width + "px";
	    	colorRange.style.width = block2.coords.left - getCoords(elem).left - coords.width + "px";
    	}  else {
    		colorRange.style.left = block2.coords.left - parent.coords.leftX + "px";
    		colorRange.style.width = getCoords(elem).left - block2.coords.left + "px";
    	}    
	}

	function onMouseUp() {
	    document.removeEventListener('mouseup', onMouseUp);
	    document.removeEventListener('mousemove', onMouseMove);
	    document.removeEventListener('touchend', onMouseUp);
	    document.removeEventListener('touchmove', onMouseMove);
	}
}
