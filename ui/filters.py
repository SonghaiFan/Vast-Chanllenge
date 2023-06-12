"""
    GUI for filter bar
"""
import ipywidgets as widgets
from IPython.display import display

class UIFilterBar:
    
    def __init__(self):
        self._node_types = ['Person', 'Company', 'Organization', 'Vessel', 'Event', 'Movement', 'Location','Political_Organization']
        self._link_types = ['Family_Relationship', 'Ownership', 'Partnership', 'Membership']
        
        self._node_checkboxes = [widgets.Checkbox(description=type) for type in self._node_types]
        self._link_checkboxes = [widgets.Checkbox(description=type) for type in self._link_types]
        
        self._node_widgets = widgets.HBox(self._node_checkboxes[0:4], layout=widgets.Layout(margin='1px'))
        self._node_widgets2 = widgets.HBox(self._node_checkboxes[4:], layout=widgets.Layout(margin='1px',margin_bottom='10px'))
        self._link_widgets = widgets.HBox(self._link_checkboxes, layout=widgets.Layout(margin='1px'))
        
        self._container = widgets.VBox([widgets.VBox([widgets.HBox([widgets.Label('Node type:'),self._node_widgets]),self._node_widgets2]),
                                       widgets.HBox([widgets.Label('Edge type:'),self._link_widgets])])
        
    def show(self):
        display(self._container)
        return self
    @property
    def node_types(self):
        return [type.description.lower() for type in self._node_checkboxes if (type.value and isinstance(type, widgets.Checkbox))]
    @property
    def link_types(self):
        return [type.description.lower() for type in self._link_checkboxes if (type.value and isinstance(type, widgets.Checkbox))]