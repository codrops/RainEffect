export function random(from=null,to=null,interpolation=null){
  if(from==null){
    from=0;
    to=1;
  }else if(from!=null && to==null){
    to=from;
    from=0;
  }
  const delta=to-from;

  if(interpolation==null){
    interpolation=(n)=>{
      return n;
    }
  }
  return from+(interpolation(Math.random())*delta);
}
export function chance(c){
  return random()<=c;
}
