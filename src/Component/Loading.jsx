import gif from '../img/cut.gif'

const Loading = () => {
    return (
        <div className='h-screen w-full overflow-hidden'>
            <img src={gif} alt="animation" height={'100%'} width='100%' />
        </div>
    )
}

export default Loading