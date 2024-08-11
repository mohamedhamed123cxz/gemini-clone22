import React, { useContext, useState } from 'react';
import './Sidebar.css';
import icon from '../../assets/icon.png';
import newchatIcon from '../../assets/blus.png';
import recent from '../../assets/recent.png';
import help from '../../assets/help.png';
import activity from '../../assets/activity.png';
import settings from '../../assets/setting.png';
import { Context } from '../../context/Context';

function Sidebar() {
  const [extended, setExtended] = useState(false);
  const { onSent, setRecentprompts, prevPrompts, showResult, setShowResult, setResultData } = useContext(Context);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const loadPrompt = async (prompt) => {
    setRecentprompts(prompt);
    await onSent(prompt);
    setShowResult(false);
    setResultData("");
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className='sidebar'>
      <div className='top'>
        <img onClick={() => setExtended((prev) => !prev)} className='menu' src={icon} alt=''/>
      </div>
      <div onClick={() => setExtended(true)} className='new-chat'>
        <img src={newchatIcon} alt=''/>
        {extended ? <p>New Chat</p> : null}
      </div>
      {extended ? (
        <div className='recent'>
          <p className='recent-title'>Recent</p>
          {prevPrompts.map((item, index) => (
            <div onClick={() => loadPrompt(item)} className='recent-entry' key={index}>
              <img src={recent} alt=''/>
              <p>{item.slice(0, 18)} ...</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className='bottom'>
        <div className='bottom-item recent-entry' onClick={() => toggleDropdown('help')}>
          <img src={help} alt=''/>
          {extended ? <p>Help</p> : null}
        </div>
        {activeDropdown === 'help' && (
          <div className='dropdown-menu'>
            <p>Help Center</p>
            <p>Updates & FAQ</p>
          </div>
        )}
        <div className='bottom-item recent-entry' onClick={() => toggleDropdown('activity')}>
          <img src={activity} alt=''/>
          {extended ? <p>Activity</p> : null}
        </div>
        {activeDropdown === 'activity' && (
          <div className='dropdown-menu'>
            <p>My Activity</p>
            <p>Shared with me</p>
          </div>
        )}
        <div className='bottom-item recent-entry' onClick={() => toggleDropdown('settings')}>
          <img src={settings} alt=''/>
          {extended ? <p>Settings</p> : null}
        </div>
        {activeDropdown === 'settings' && (
          <div className='dropdown-menu'>
            <p>Theme</p>
            <p>Language</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;